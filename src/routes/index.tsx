import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Activity, ArrowUpRight, Check, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical-report.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Atelier Labs — Understand your medical reports" },
    { name: "description", content: "A clear space to understand medical reports. Explore a sample, upload a text-based PDF, and ask questions grounded in your report." },
    { property: "og:title", content: "Atelier Labs — Understand your medical reports" },
    { property: "og:description", content: "Medical reports, explained in plain language with report-grounded answers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Logo() {
  return <Link to="/" className="flex items-center gap-2.5" aria-label="Atelier Labs home"><span className="grid size-9 place-items-center rounded-lg bg-mint text-primary-foreground"><Activity size={19} strokeWidth={2.2} /></span><span className="font-display text-[21px] font-semibold">Atelier<span className="ml-2 font-mono text-[10px] font-normal uppercase text-ink-soft">/ labs</span></span></Link>;
}

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const signIn = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) { setFormError("Enter any email and password to continue the demo."); return; }
    sessionStorage.setItem("atelier-demo-name", email.split("@")[0] || "Guest");
    navigate({ to: "/dashboard" });
  };
  return <div className="min-h-screen overflow-hidden bg-paper font-body">
    <header className="relative z-30 border-b border-line bg-surface/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-10"><Logo /><div className="hidden items-center gap-9 text-sm text-ink-soft md:flex"><a href="#how-it-works" className="transition-colors hover:text-ink">How it works</a><a href="#privacy" className="transition-colors hover:text-ink">Privacy</a></div><Button asChild variant="default" className="h-10 rounded-full px-5 shadow-none"><a href="#signin">Try the demo <ArrowUpRight size={15} /></a></Button></nav>
    </header>

    <main>
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.02fr_1fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="animate-rise relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[10px] uppercase text-ink-soft"><span className="size-1.5 rounded-full bg-mint" /> A clearer way to read your health</div>
          <h1 className="max-w-[13ch] font-display text-5xl font-semibold leading-[1.06] text-ink sm:text-6xl lg:text-[72px]">Your lab report, finally in <em className="font-medium text-mint-deep">plain English.</em></h1>
          <p className="mt-7 max-w-[47ch] text-[17px] leading-relaxed text-ink-soft">From complex results to clear understanding. Upload a report, see what it says in everyday language, and ask the questions still on your mind.</p>
          <div className="mt-9 flex flex-wrap items-center gap-5"><Button asChild className="h-12 rounded-full px-6 text-sm shadow-none transition-transform hover:-translate-y-0.5"><a href="#signin">Open the demo <ArrowRight size={16} /></a></Button><span className="font-mono text-[10px] uppercase text-ink-soft">No account required · Sample data included</span></div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-6 text-xs text-ink-soft"><span className="flex items-center gap-2"><Check size={15} className="text-mint-deep" /> Plain-language summaries</span><span className="flex items-center gap-2"><Check size={15} className="text-mint-deep" /> Answers from your report</span><span className="flex items-center gap-2"><Check size={15} className="text-mint-deep" /> No diagnosis claims</span></div>
        </div>
        <div className="animate-rise-late relative mx-auto w-full max-w-[570px] pb-7">
          <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-[0_35px_90px_-45px_var(--mint-deep)]">
            <div className="relative h-[220px] overflow-hidden sm:h-[260px]"><img src={heroImage} alt="A printed lab report on a sunlit desk" width={1280} height={1024} className="h-full w-full object-cover object-center" /><div className="absolute bottom-4 left-4 rounded-md border border-line bg-surface/90 px-3 py-2 backdrop-blur-md"><span className="flex items-center gap-2 text-xs font-medium"><FileText size={15} className="text-mint-deep" /> Complete_Metabolic_Panel.pdf</span></div></div>
            <div className="p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase text-mint-deep">Your summary</span><span className="rounded-full bg-mint-wash px-2.5 py-1 font-mono text-[9px] uppercase text-mint-deep">Sample report</span></div><p className="mt-3 text-sm leading-relaxed">Most values are within the report's reference ranges. One kidney filtration marker is noted for discussion with a clinician.</p><div className="mt-5 grid grid-cols-3 gap-2.5">{[{ label: "Glucose", value: "92", unit: "mg/dL", width: "w-[49%]", color: "bg-mint" }, { label: "eGFR", value: "74", unit: "mL/min", width: "w-[66%]", color: "bg-amber" }, { label: "ALT", value: "22", unit: "U/L", width: "w-[42%]", color: "bg-mint" }].map((item) => <div key={item.label} className="min-w-0 rounded-md border border-line bg-paper/70 p-3"><span className="font-mono text-[9px] uppercase text-ink-soft">{item.label}</span><p className="mt-1 font-display text-xl font-semibold">{item.value}<span className="ml-1 font-body text-[9px] font-normal text-ink-soft">{item.unit}</span></p><div className="mt-3 h-1 rounded-full bg-line"><div className={`animate-bar h-full rounded-full ${item.width} ${item.color}`} /></div></div>)}</div></div>
          </div>
          <div className="animate-float absolute -bottom-1 -left-2 hidden max-w-[260px] rounded-md border border-line bg-surface/95 p-4 shadow-xl backdrop-blur-xl sm:block lg:-left-10"><div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-mint-deep" /> Ask your report</div><p className="mt-2 text-xs text-ink-soft">“What should I ask my doctor about the eGFR number?”</p></div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-line bg-surface/65 py-16"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase text-mint-deep">Clarity in three steps</p><h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">From report to understanding.</h2></div><p className="max-w-sm text-sm leading-relaxed text-ink-soft">The original report stays the source of truth. The explanation helps you prepare for a better conversation.</p></div><div className="grid gap-6 border-t border-line pt-8 md:grid-cols-3">{[{ n: "01", title: "Bring your report", text: "Choose a text-based PDF and let us read the details on the page.", Icon: FileText }, { n: "02", title: "See the essentials", text: "Review a simple summary, key values, and what the document actually notes.", Icon: Activity }, { n: "03", title: "Ask what matters", text: "Get answers tied to the report so you know what to bring up with your clinician.", Icon: Sparkles }].map(({ n, title, text, Icon }) => <div key={n} className="pr-5"><div className="flex items-center justify-between"><span className="font-mono text-xs text-mint-deep">{n} / 03</span><Icon size={19} strokeWidth={1.5} className="text-mint-deep" /></div><h3 className="mt-8 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ink-soft">{text}</p></div>)}</div></div></section>

      <section id="signin" className="scroll-mt-20 mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28"><div><span className="font-mono text-[10px] uppercase text-mint-deep">A hands-on preview</span><h2 className="mt-4 max-w-[15ch] font-display text-4xl font-semibold leading-tight sm:text-5xl">Explore the workspace yourself.</h2><p className="mt-5 max-w-[45ch] leading-relaxed text-ink-soft">Use any email and password to enter the demo. Start with a fictional sample report, or add a text-based PDF of your own.</p><div className="mt-9 space-y-4 border-t border-line pt-7"><div className="flex gap-3"><span className="font-mono text-xs text-mint-deep">01</span><span className="text-sm">Read a clear summary and key findings</span></div><div className="flex gap-3"><span className="font-mono text-xs text-mint-deep">02</span><span className="text-sm">Ask follow-up questions about that report</span></div><div className="flex gap-3"><span className="font-mono text-xs text-mint-deep">03</span><span className="text-sm">Switch between previous sample reports</span></div></div></div><div className="rounded-lg border border-line bg-surface p-7 shadow-[0_25px_75px_-50px_var(--ink-soft)] sm:p-9"><div className="mb-7 flex size-11 items-center justify-center rounded-md bg-mint-wash text-mint-deep"><Activity size={22} /></div><h3 className="font-display text-3xl font-semibold">Demo sign-in</h3><p className="mt-2 text-sm text-ink-soft">No real account is created.</p><form onSubmit={signIn} className="mt-8 space-y-4"><label className="block text-xs font-medium">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-md border border-line bg-paper px-4 text-sm outline-none transition focus:border-mint" /></label><label className="block text-xs font-medium">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Any password for this demo" className="mt-2 h-12 w-full rounded-md border border-line bg-paper px-4 text-sm outline-none transition focus:border-mint" /></label>{formError && <p className="text-xs text-destructive" role="alert">{formError}</p>}<Button type="submit" className="h-12 w-full rounded-md text-sm shadow-none">Enter demo workspace <ArrowRight size={16} /></Button></form><p className="mt-5 text-xs leading-relaxed text-ink-soft">Demo only. Your input is not used to authenticate or create an account.</p></div></section>
    </main>
    <footer id="privacy" className="border-t border-line bg-surface/70 py-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 lg:px-10"><Logo /><p className="flex max-w-xl items-start gap-2 text-xs leading-relaxed text-ink-soft"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-mint-deep" /> Educational explanations only, not a diagnosis or a substitute for advice from your clinician. Demo reports are fictional.</p></div></footer>
  </div>;
}
