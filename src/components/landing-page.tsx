import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/mobile-menu";
import SystemStatus from "@/components/system-status";
import ScrollEffects from "@/components/scroll-effects";

function ShieldMark() {
  return <Image src="/icon.png" alt="" width={28} height={28} className="rounded-md" />;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4"><path d="M3 10h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

const methodology = [
  ["01", "Drop your document", "Paste your raw contract text or upload a PDF. Our engine preserves the exact structure and alignment of the clauses.", "Drag and drop standard legal text directly into the analyzer.", "green"],
  ["02", "Clause-by-clause analysis", "Every paragraph is measured against what is standard for your jurisdiction, industry, and funding stage.", "Scanning — 23 standard clauses detected.", "blue"],
  ["03", "Visual margin flags", "Risky structures are highlighted High, medium, and low risks are clearly grouped with distinct color-coded annotations.", "CRITICAL RISK: Automatic renewal clause with no opt-out window.", "red"],
  ["04", "Plain-English diagnosis", "Understand the real commercial impact of what you are agreeing to, written without passive legalese.", "RECOMMENDED ACTION: Renegotiate notice and payment terms.", "green"],
];

export default function LandingPage() {
  return (
    <main id="main-content" className="overflow-hidden bg-white text-ink">
      <a href="#methodology" className="skip-link">Skip to platform details</a>
      <ScrollEffects />
      <header className="border-b border-line/80 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="ClauseGuard home"><ShieldMark /><span className="text-[15px] font-bold tracking-[-0.04em]">ClauseGuard</span></Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-[12px] font-medium text-slate md:flex"><a href="#methodology">Platform</a><a href="#evaluation">Accuracy Test</a><a href="#methodology">Methodology</a></nav>
          <MobileMenu items={[{ label: "Platform", href: "#methodology" }, { label: "Accuracy Test", href: "#evaluation" }, { label: "Methodology", href: "#methodology" }]} />
          <Link href="/analyzer" className="flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-[12px] font-semibold text-white transition-transform hover:-translate-y-0.5">Try it free <ArrowIcon /></Link>
        </div>
      </header>

      <section data-scroll-reveal aria-labelledby="hero-title" className="bg-[#f7f9fc] px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="mx-auto inline-flex rounded-full border border-line bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Clinical legal analysis for modern teams</p>
          <h1 id="hero-title" className="mx-auto mt-6 max-w-[700px] text-[42px] font-bold leading-[1.04] tracking-[-0.065em] sm:text-[64px]">Know what you&apos;re signing<br />before you sign it.</h1>
          <p className="mx-auto mt-6 max-w-[565px] text-[14px] leading-6 text-slate sm:text-[15px]">ClauseGuard highlights hidden risks, strips away the legalese, and explains the consequences in plain, direct English. Built for instantly analyzing SaaS agreements, NDAs, and service contracts.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/analyzer" className="flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-[12px] font-semibold text-white">Try it free <ArrowIcon /></Link></div>
        </div>

        <div data-scroll-reveal className="mx-auto mt-14 grid max-w-[1000px] gap-5 rounded-xl border border-line bg-white p-5 shadow-card sm:mt-20 sm:grid-cols-[1.45fr_0.8fr] sm:p-8">
          <div className="rounded border border-line bg-[#fbfcfe] p-5 sm:p-7">
            <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-muted">Mutual non-disclosure agreement</p>
            <div className="mt-6 space-y-4 text-[10px] leading-5 text-[#8291a8]"><p>This Non-Disclosure Agreement is entered into as of the Effective Date by and between the disclosing party and the receiving party.</p><p className="border-l-2 border-red bg-[#fff7f7] px-3 py-3 font-serif italic text-[#6d7482]">4.2 Remedies. The Receiving Party agrees that any breach may cause irreparable harm. The Disclosing Party may seek immediate injunctive relief.</p><p>5.1 Term. The commitments of this Agreement shall survive for a period of five years.</p><p className="border-l-2 border-blue bg-blue-pale/60 px-3 py-3 font-serif italic text-[#6d7482]">6.7 Jurisdiction. Any dispute arising out of this contract shall be resolved by arbitration.</p></div>
          </div>
          <div className="space-y-4"><p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-blue"><span className="h-1.5 w-1.5 rounded-full bg-blue" /> Detections (2)</p><div className="rounded-md border border-red bg-white p-4"><p className="text-[8px] font-bold uppercase text-red">Critical risk <span className="float-right text-muted">Section 4.2</span></p><h3 className="mt-3 text-[12px] font-bold text-ink">Immediate injunction without notice</h3><p className="mt-2 text-[10px] leading-4 text-slate">Normally, a court requires a notice period before stopping your business operations.</p></div><div className="rounded-md border border-blue bg-white p-4"><p className="text-[8px] font-bold uppercase text-blue">Muted risk <span className="float-right text-muted">Section 6.7</span></p><h3 className="mt-3 text-[12px] font-bold text-ink">Unbalanced dispute costs</h3><p className="mt-2 text-[10px] leading-4 text-slate">This clause forces you to pay all legal bills if you are sued.</p></div></div>
        </div>
      </section>

      <section data-scroll-reveal id="methodology" className="px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-[1040px]"><div className="text-center"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue">Platform architecture</p><h2 className="mt-4 text-[30px] font-bold tracking-[-0.055em] sm:text-[38px]">How ClauseGuard reviews your contract</h2></div><div className="mt-12 space-y-4">{methodology.map(([number, title, body, quote, color]) => <div data-scroll-reveal key={number} className="grid gap-5 rounded-lg border border-line bg-[#f8fafc] p-5 sm:grid-cols-[90px_1fr_1fr] sm:items-center sm:p-6"><div><p className="text-[30px] font-bold tracking-[-0.06em] text-[#dbe4ef]">{number}</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-muted">Phase {number}</p></div><div><h3 className="text-[15px] font-bold text-ink">{title}</h3><p className="mt-2 text-[11px] leading-5 text-slate">{body}</p></div><div className="rounded border border-line bg-white p-4 text-[11px] italic leading-5 text-slate"><span className={"mb-2 block text-[8px] font-bold not-italic uppercase tracking-[0.1em] text-" + color}>● Simulation state</span>“{quote}”</div></div>)}</div></div></section>

      <section data-scroll-reveal id="evaluation" className="bg-[#f1f5fa] px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto grid max-w-[1040px] gap-10 sm:grid-cols-[0.85fr_1fr] sm:items-center"><div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue">Stress tested for accuracy</p><p className="mt-5 text-[72px] font-bold leading-none tracking-[-0.08em] text-ink">17<span className="ml-2 text-[25px] tracking-[-0.04em]">of 20</span></p><h2 className="mt-5 text-[17px] font-bold text-ink">Known-risk clauses correctly flagged in independent evaluation.</h2><p className="mt-3 max-w-sm text-[12px] leading-5 text-slate">Our engine was evaluated against standard commercial documents containing deliberately concealed liabilities and indemnification traps.</p></div><div className="rounded-lg border border-line bg-white p-6 shadow-card"><h3 className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink">Evaluation report breakdown</h3>{[["Liability Caps","Detected hidden exclusions designed to bypass cap limits.","5 / 5 caught"],["IP Ownership","Flagged overly broad definitions of recipient creations.","4 / 4 caught"],["Termination","Identified automatic evergreen renewals with zero notice.","5 / 6 caught"],["Governing Law","Identified asymmetric dispute resolution provisions.","3 / 5 caught"]].map(([title, body, score]) => <div key={title} className="border-b border-line py-4 last:border-0"><div className="flex justify-between gap-4 text-[11px] font-semibold text-ink"><span>{title}</span><span className="text-blue">{score}</span></div><p className="mt-1 text-[10px] text-muted">{body}</p></div>)}</div></div><div className="mx-auto mt-12 max-w-[1040px] rounded-lg border border-line bg-white px-5 py-4 text-[10px] leading-5 text-muted"><strong className="mr-2 uppercase tracking-[0.1em] text-slate">Important legal notice</strong> ClauseGuard is an informational first-pass analysis tool and does not provide professional legal advice.</div></section>

      <section data-scroll-reveal aria-labelledby="cta-title" className="bg-ink px-5 py-24 text-center text-white sm:px-8 sm:py-32"><h2 id="cta-title" className="mx-auto max-w-[560px] text-[36px] font-bold leading-[1.04] tracking-[-0.06em] sm:text-[50px]">Understand your liability<br />before you sign.</h2><p className="mx-auto mt-5 max-w-md text-[13px] leading-6 text-[#a9b5c7]">Start scanning contracts immediately. No credit card required. No upfront configuration. Just clear insights.</p><Link href="/analyzer" className="mt-7 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-[12px] font-semibold text-ink">Try ClauseGuard free <ArrowIcon /></Link></section>

      <footer aria-label="Site footer" className="bg-white px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-[1180px] flex-col gap-6 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><ShieldMark /><span className="font-bold text-ink">ClauseGuard</span></div><div className="flex flex-wrap gap-5"><Link href="/">Terms of Use</Link><Link href="/">Privacy Policy</Link><Link href="/">Disclaimer</Link><Link href="/">Contact Support</Link></div><span>© 2026 ClauseGuard Systems Inc.</span><SystemStatus /></div></footer>
    </main>
  );
}
