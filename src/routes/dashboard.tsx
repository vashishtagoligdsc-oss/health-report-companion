import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Activity, ArrowRight, ArrowUpRight, Check, ChevronRight, FileText, LogOut, MessageCircle, Plus, Send, ShieldCheck, Sparkles, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoReports, type Report } from "@/lib/demo-reports";
import { analyzeReport, askReport } from "@/lib/report.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Report workspace — Atelier Labs" },
    { name: "description", content: "Explore report summaries, previous reports, PDF upload, and questions grounded in the document in the Atelier Labs demo." },
    { property: "og:title", content: "Report workspace — Atelier Labs" },
    { property: "og:description", content: "A clear workspace to understand medical reports and ask questions." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Dashboard,
});

type Message = { role: "user" | "assistant"; text: string };

function Dashboard() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeReport);
  const ask = useServerFn(askReport);
  const [reports, setReports] = useState<Report[]>(demoReports);
  const [selectedId, setSelectedId] = useState(demoReports[0].id);
  const [name, setName] = useState("Guest");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [uploading, setUploading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const selected = reports.find((report) => report.id === selectedId) ?? reports[0];
  const chat = messages[selectedId] ?? [];

  useEffect(() => { setName(sessionStorage.getItem("atelier-demo-name") || "Guest"); }, []);
  const logout = () => { sessionStorage.removeItem("atelier-demo-name"); navigate({ to: "/" }); };

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { setError("Please choose a PDF file."); return; }
    if (file.size > 3_500_000) { setError("Please choose a PDF smaller than 3.5 MB for this demo."); return; }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(new Error("Could not read this file."));
        reader.readAsDataURL(file);
      });
      const result = await analyze({ data: { filename: file.name, base64 } });
      const report: Report = { id: crypto.randomUUID(), title: result.title, date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }), kind: `${result.pages} page${result.pages === 1 ? "" : "s"} · PDF`, summary: result.summary, findings: result.findings, nextSteps: result.nextSteps, sourceText: result.sourceText };
      setReports((current) => [report, ...current]); setSelectedId(report.id);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not analyze this report."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  function handleDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragOver(false); void handleFile(event.dataTransfer.files[0]); }
  function handleChange(event: ChangeEvent<HTMLInputElement>) { void handleFile(event.target.files?.[0]); }
  async function handleAsk(event: FormEvent) {
    event.preventDefault();
    const text = question.trim(); if (!text || !selected || answering) return;
    setQuestion(""); setError(""); setAnswering(true);
    const id = selected.id;
    setMessages((current) => ({ ...current, [id]: [...(current[id] ?? []), { role: "user", text }] }));
    try { const result = await ask({ data: { sourceText: selected.sourceText, question: text } }); setMessages((current) => ({ ...current, [id]: [...(current[id] ?? []), { role: "assistant", text: result.answer }] })); }
    catch { setMessages((current) => ({ ...current, [id]: [...(current[id] ?? []), { role: "assistant", text: "I couldn't answer that right now. Please try again." }] })); }
    finally { setAnswering(false); }
  }

  return <div className="min-h-screen bg-paper font-body text-ink">
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-4 px-5 lg:px-9"><Link to="/" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-lg bg-mint text-primary-foreground"><Activity size={19} /></span><span className="font-display text-xl font-semibold">Atelier <span className="font-mono text-[10px] font-normal uppercase text-ink-soft">/ labs</span></span></Link><span className="hidden rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[10px] uppercase text-ink-soft sm:inline-flex">Interactive demo</span><div className="flex items-center gap-3"><span className="hidden text-xs text-ink-soft sm:block">Hello, {name}</span><Button variant="ghost" size="icon" title="Leave demo" aria-label="Leave demo" onClick={logout}><LogOut size={17} /></Button></div></div></header>
    <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-9 lg:px-9">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase text-mint-deep">Your workspace / Overview</p><h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Your reports, made clearer.</h1><p className="mt-3 text-sm text-ink-soft">A thoughtful space to read, understand, and ask.</p></div><Button onClick={() => fileRef.current?.click()} className="h-11 rounded-md px-5 shadow-none" disabled={uploading}><Plus size={16} /> New report</Button></div>
      {error && <div role="alert" className="mb-5 flex items-start justify-between gap-4 rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"><span>{error}</span><Button variant="ghost" size="icon" className="size-5 text-destructive" aria-label="Dismiss error" onClick={() => setError("")}><X size={14} /></Button></div>}
      <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="space-y-7"><div onDrop={handleDrop} onDragOver={(event) => { event.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} className={`rounded-md border-2 border-dashed p-6 text-center transition-colors ${dragOver ? "border-mint bg-mint-wash" : "border-mint/35 bg-mint-wash/45"}`}><input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleChange} aria-label="Upload a PDF report" /><div className="mx-auto grid size-11 place-items-center rounded-md bg-surface text-mint-deep"><UploadCloud size={21} /></div><h2 className="mt-4 font-display text-xl font-semibold">{uploading ? "Reading your report…" : "Drop a PDF here"}</h2><p className="mt-1 text-xs leading-relaxed text-ink-soft">Text-based PDFs, up to 3.5 MB</p><Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-5 rounded-md bg-surface shadow-none">{uploading ? "Analyzing…" : "Browse files"} <ArrowUpRight size={14} /></Button></div>
          <div><div className="mb-4 flex items-center justify-between"><h2 className="font-mono text-[10px] uppercase text-ink-soft">Previous reports</h2><span className="font-mono text-[10px] text-ink-soft">{String(reports.length).padStart(2, "0")}</span></div><div className="space-y-2">{reports.map((report) => <Button key={report.id} variant="ghost" onClick={() => { setSelectedId(report.id); setError(""); }} className={`h-auto w-full justify-start whitespace-normal rounded-md border p-3 text-left shadow-none ${selectedId === report.id ? "border-mint/45 bg-surface" : "border-line bg-surface/55 hover:border-mint/30"}`}><span className={`grid size-9 shrink-0 place-items-center rounded-md ${selectedId === report.id ? "bg-mint-wash text-mint-deep" : "bg-paper text-ink-soft"}`}><FileText size={17} /></span><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold">{report.title}</span><span className="mt-0.5 block text-[11px] font-normal text-ink-soft">{report.date} · {report.kind}</span></span><ChevronRight size={15} className="text-ink-soft" /></Button>)}</div></div><div className="border-t border-line pt-5"><div className="flex gap-2.5"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-mint-deep" /><p className="text-xs leading-relaxed text-ink-soft">Reports you upload remain in this demo session only. Avoid uploading sensitive personal information for a public presentation.</p></div></div></aside>
        {selected && <main className="min-w-0 animate-rise space-y-6" key={selected.id}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4"><div className="flex items-center gap-2 text-xs text-ink-soft"><FileText size={15} className="text-mint-deep" /><span>{selected.title}</span><ChevronRight size={13} /><span>Overview</span></div><span className="rounded-full bg-mint-wash px-3 py-1.5 font-mono text-[10px] uppercase text-mint-deep">{selected.isSample ? "Fictional sample" : "Uploaded this session"}</span></div>
          <section className="rounded-md border border-line bg-surface p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase text-mint-deep">01 / The overview</p><h2 className="mt-2 font-display text-3xl font-semibold">The plain-language read.</h2></div><span className="text-xs text-ink-soft">{selected.date}</span></div><div className="relative mt-6 overflow-hidden rounded-md border border-line bg-paper p-5"><div className="scan-line pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-mint/15 to-transparent" /><p className="relative text-[15px] leading-[1.85] text-ink">{selected.summary}</p></div><div className="mt-5 flex items-start gap-2.5 border-t border-line pt-5 text-xs leading-relaxed text-ink-soft"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-mint-deep" /><span>This explains what the document says. It is not a diagnosis, and your clinician should interpret results in context.</span></div></section>
          <section><div className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><p className="font-mono text-[10px] uppercase text-mint-deep">02 / What stands out</p><h2 className="mt-2 font-display text-2xl font-semibold">Key findings</h2></div><span className="text-xs text-ink-soft">From this report only</span></div>{selected.findings.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{selected.findings.map((finding, index) => <div key={`${finding.label}-${index}`} className="rounded-md border border-line bg-surface p-5"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] uppercase text-ink-soft">{finding.label}</span><span className={`size-2 shrink-0 rounded-full ${finding.status === "Within range" ? "bg-mint" : "bg-amber"}`} /></div><p className="mt-4 font-display text-3xl font-semibold">{finding.value}<span className="ml-1.5 font-body text-[11px] font-normal text-ink-soft">{finding.unit}</span></p><p className={`mt-2 text-xs font-medium ${finding.status === "Within range" ? "text-mint-deep" : "text-amber"}`}>{finding.status}</p><p className="mt-2 text-xs leading-relaxed text-ink-soft">{finding.note}</p><p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-ink-soft">Report: “{finding.source}”</p></div>)}</div> : <div className="rounded-md border border-line bg-surface p-5 text-sm text-ink-soft">No exact quoted values could be confirmed from the extracted text. See the summary and consult the original PDF.</div>}</section>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]"><section className="rounded-md border border-line bg-surface p-6"><div className="flex items-center gap-2"><Sparkles size={18} className="text-mint-deep" /><h2 className="font-display text-2xl font-semibold">Ask about this report</h2></div><p className="mt-2 text-xs text-ink-soft">Answers use the selected report as context.</p><div className="mt-6 min-h-[170px] space-y-4">{chat.length ? chat.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[92%] rounded-md px-4 py-3 text-sm leading-relaxed sm:max-w-[85%] ${message.role === "user" ? "bg-mint-deep text-primary-foreground" : "border border-line bg-paper text-ink"}`}>{message.role === "assistant" && <span className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase text-mint-deep"><Activity size={12} /> Atelier</span>}{message.text}</div></div>) : <div className="flex min-h-[170px] flex-col items-center justify-center text-center"><span className="grid size-10 place-items-center rounded-md bg-mint-wash text-mint-deep"><MessageCircle size={19} /></span><p className="mt-3 text-sm font-medium">Curious about a result?</p><p className="mt-1 text-xs text-ink-soft">Ask a question about this report.</p></div>}{answering && <p className="text-xs text-ink-soft" role="status">Reading the report for an answer…</p>}</div><form onSubmit={handleAsk} className="mt-5 flex items-center gap-2 rounded-md border border-line bg-paper p-2"><input aria-label="Question about this report" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about this report…" maxLength={500} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-ink-soft" /><Button type="submit" size="icon" aria-label="Send question" disabled={answering || !question.trim()} className="size-9 shrink-0 rounded-md shadow-none"><Send size={15} /></Button></form></section><aside className="rounded-md border border-line bg-mint-wash/45 p-6"><span className="font-mono text-[10px] uppercase text-mint-deep">03 / For your next visit</span><h2 className="mt-3 font-display text-2xl font-semibold">A good conversation starts here.</h2><div className="mt-5 space-y-4">{selected.nextSteps.map((step, index) => <div key={index} className="flex items-start gap-3 border-t border-mint/20 pt-3"><span className="font-mono text-xs text-mint-deep">0{index + 1}</span><p className="text-sm leading-relaxed">{step}</p></div>)}</div><div className="mt-7 flex items-center gap-2 border-t border-mint/20 pt-4 text-xs text-ink-soft"><Check size={14} className="text-mint-deep" /> Bring your original report along</div></aside></div>
        </main>}
      </div>
      <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-soft"><span>Atelier Labs · A medical report understanding demo</span><Link to="/" className="flex items-center gap-1 hover:text-ink">Back to home <ArrowRight size={13} /></Link></footer>
    </div>
  </div>;
}
