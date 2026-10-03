export type Finding = { label: string; value: string; unit: string; status: "Within range" | "Worth discussing"; note: string; source: string };
export type Report = { id: string; title: string; date: string; kind: string; summary: string; findings: Finding[]; nextSteps: string[]; sourceText: string; isSample?: boolean };

export const demoReports: Report[] = [
  {
    id: "metabolic", title: "Complete Metabolic Panel", date: "12 Mar 2026", kind: "Blood test", isSample: true,
    summary: "Most values in this sample report are within the lab's reference ranges. Kidney filtration (eGFR) is listed at 74 mL/min/1.73m². The report marks it for discussion with a clinician; a single result alone does not establish a diagnosis.",
    findings: [
      { label: "Glucose", value: "92", unit: "mg/dL", status: "Within range", note: "Within the listed 70–99 range", source: "Glucose 92 mg/dL (70–99)" },
      { label: "eGFR", value: "74", unit: "mL/min/1.73m²", status: "Worth discussing", note: "Report note: discuss with clinician", source: "eGFR 74 mL/min/1.73m²; note: discuss with clinician" },
      { label: "ALT", value: "22", unit: "U/L", status: "Within range", note: "Within the listed 7–56 range", source: "ALT 22 U/L (7–56)" },
    ],
    nextSteps: ["Ask your clinician about the eGFR result and whether prior results offer useful context.", "Keep the original report available for your appointment."],
    sourceText: "SAMPLE REPORT — Complete Metabolic Panel, 12 March 2026. Glucose 92 mg/dL (reference 70–99). eGFR 74 mL/min/1.73m²; report note: discuss with clinician. ALT 22 U/L (reference 7–56). Sodium 140 mmol/L (reference 135–145). Creatinine 0.95 mg/dL (reference 0.6–1.3). This is fictional demonstration data, not a real patient record."
  },
  {
    id: "thyroid", title: "Thyroid Function Panel", date: "28 Jan 2026", kind: "Blood test", isSample: true,
    summary: "The thyroid markers shown in this sample report are inside their stated reference ranges. The report does not describe an abnormal finding. Discuss symptoms or treatment questions with the doctor who ordered the test.",
    findings: [
      { label: "TSH", value: "2.1", unit: "mIU/L", status: "Within range", note: "Within the listed 0.4–4.0 range", source: "TSH 2.1 mIU/L (0.4–4.0)" },
      { label: "Free T4", value: "1.2", unit: "ng/dL", status: "Within range", note: "Within the listed 0.8–1.8 range", source: "Free T4 1.2 ng/dL (0.8–1.8)" }
    ],
    nextSteps: ["Review these results with your clinician in the context of your symptoms."],
    sourceText: "SAMPLE REPORT — Thyroid Function Panel, 28 January 2026. TSH 2.1 mIU/L (reference 0.4–4.0). Free T4 1.2 ng/dL (reference 0.8–1.8). Fictional demonstration data."
  },
  {
    id: "cbc", title: "Complete Blood Count", date: "04 Nov 2025", kind: "Blood test", isSample: true,
    summary: "The displayed blood-count markers in this sample report fall within their listed laboratory ranges. The report itself does not flag these results. A clinician can interpret them alongside your history.",
    findings: [
      { label: "Hemoglobin", value: "13.8", unit: "g/dL", status: "Within range", note: "Within the listed 12–16 range", source: "Hemoglobin 13.8 g/dL (12–16)" },
      { label: "WBC", value: "6.4", unit: "×10³/µL", status: "Within range", note: "Within the listed 4–11 range", source: "WBC 6.4 ×10³/µL (4–11)" }
    ],
    nextSteps: ["Bring questions about symptoms or trends to your clinician."],
    sourceText: "SAMPLE REPORT — Complete Blood Count, 04 November 2025. Hemoglobin 13.8 g/dL (reference 12–16). White blood cells 6.4 ×10³/µL (reference 4–11). Fictional demonstration data."
  },
];
