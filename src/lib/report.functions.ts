import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { demoReports, type Finding } from "./demo-reports";

const analysisInput = z.object({ filename: z.string().max(160), base64: z.string().max(5_000_000) });
const questionInput = z.object({ sourceText: z.string().min(10).max(30_000), question: z.string().min(3).max(500) });

async function complete(system: string, user: string): Promise<string> {
  const url = process.env['AGW_URL'];
  const token = process.env['AGW_TOKEN'];
  if (!url || !token) throw new Error("Report analysis is temporarily unavailable.");
  const endpoint = `${url.replace(/\/$/, "").replace(/\/v1$/, "")}/v1/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ model: "google/gemini-3.1-flash-lite", temperature: 0.1, max_tokens: 1200, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error("Report analysis is temporarily unavailable. Please try again.");
  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error("No response was returned. Please try again.");
  return content;
}

const outputSchema = z.object({ summary: z.string(), findings: z.array(z.object({ label: z.string(), value: z.string(), unit: z.string(), status: z.enum(["Within range", "Worth discussing"]), note: z.string(), source: z.string() })).max(6), nextSteps: z.array(z.string()).max(3) });

export const analyzeReport = createServerFn({ method: "POST" })
  .inputValidator((input) => analysisInput.parse(input))
  .handler(async ({ data }) => {
    const { getDocumentProxy, extractText } = await import("unpdf");
    let text = "";
    let pages = 0;
    try {
      const binary = Uint8Array.from(atob(data.base64), (char) => char.charCodeAt(0));
      const pdf = await getDocumentProxy(binary);
      pages = pdf.numPages;
      if (pages > 20) throw new Error("Please use a PDF with 20 pages or fewer.");
      const result = await extractText(pdf, { mergePages: true });
      text = result.text.trim();
      await pdf.destroy();
    } catch (error) {
      if (error instanceof Error && error.message.includes("20 pages")) throw error;
      throw new Error("We couldn't read this PDF. Please use a text-based, unencrypted PDF.");
    }
    if (text.length < 50) throw new Error("This PDF has little selectable text. Scanned-image PDFs are not supported in this demo.");
    text = text.slice(0, 30_000);
    const raw = await complete(
      "You explain medical report text accurately in plain English. Never diagnose, infer urgency, prescribe, or invent facts. Only include exact numbers and reference ranges present in the supplied text. If unclear, say so. Return ONLY JSON with keys summary (2-3 short sentences), findings (up to 6 objects: label, value, unit, status exactly 'Within range' or 'Worth discussing', note, source [a short verbatim quote from the document]), and nextSteps (up to 3 cautious discussion questions). Do not include patient names in the output. Never claim clinician review.",
      `Document text:\n${text}`
    );
    let parsed: z.infer<typeof outputSchema>;
    try { parsed = outputSchema.parse(JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""))); }
    catch { throw new Error("We couldn't create a reliable summary. Please try another text-based PDF."); }
    const findings: Finding[] = parsed.findings.filter((finding) => text.toLowerCase().includes(finding.source.toLowerCase()));
    return { title: data.filename.replace(/\.pdf$/i, "").replace(/[_-]/g, " "), summary: parsed.summary, findings, nextSteps: parsed.nextSteps, sourceText: text, pages };
  });

export const askReport = createServerFn({ method: "POST" })
  .inputValidator((input) => questionInput.parse(input))
  .handler(async ({ data }) => {
    const answer = await complete(
      "You answer questions only using the medical report text supplied. Be concise, empathetic, and precise. Cite an exact short phrase or value from the report in quotation marks. If the answer is not in the report, say that the report does not say and suggest asking a clinician. Do not diagnose, promise safety, prescribe, or infer urgency. End with a brief reminder that this is not medical advice when appropriate.",
      `Report text:\n${data.sourceText}\n\nQuestion: ${data.question}`
    );
    return { answer };
  });
