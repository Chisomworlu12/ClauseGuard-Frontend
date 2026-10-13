import Image from "next/image";
import Link from "next/link";

export default function SafeContractState({ fileName }: { fileName: string }) {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line/80 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="ClauseGuard home">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ink text-white shadow-sm"><Image src="/icon.png" alt="" width={24} height={24} className="h-6 w-6 rounded-md" /></span>
            <span className="text-[19px] font-bold tracking-[-0.04em]">ClauseGuard</span>
            <span className="hidden rounded-md border border-blue/20 bg-blue-pale px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-blue sm:inline-flex">Analyzer</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[14px] text-slate md:flex" aria-label="Main navigation">
            <Link className="font-semibold text-ink" href="/analyzer">New Scan</Link>
            <Link className="transition-colors hover:text-ink" href="/saved-contracts">Saved Contracts</Link>
            <span className="ml-1 h-8 w-px bg-line" aria-hidden="true" />
            <span className="rounded-full bg-[#eef2f7] px-3.5 py-2 text-xs font-semibold text-slate">CW</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex items-start gap-3.5 rounded-xl border border-line bg-white px-5 py-4 shadow-card sm:px-6">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff7e7] text-[#bd7b12]" aria-hidden="true">!</span>
          <p className="text-[13px] leading-6 text-slate sm:text-[14px]"><strong className="font-bold tracking-wide text-ink">LEGAL NOTICE:</strong>{" "}ClauseGuard provides an informational first-pass analysis, not professional legal advice, and does not create an attorney-client relationship.</p>
        </div>

        <section className="mt-9" aria-labelledby="safe-result-title">
          <h1 id="safe-result-title" className="text-[30px] font-bold tracking-[-0.05em] text-ink sm:text-[40px]">Scan Verdict: Clean Contract</h1>
          <p className="mt-3 text-[14px] leading-6 text-slate">Automatic assessment for {fileName}. Matches all baseline risk compliance parameters.</p>

          <div className="mt-8 rounded-xl border border-line bg-white px-5 py-14 text-center shadow-card sm:px-8 sm:py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eafaf4] text-green">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-9 w-9"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="m8 12 2.6 2.6L16.5 9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
            </span>
            <h2 className="mt-7 text-[23px] font-bold tracking-[-0.04em] text-ink">No risky clauses found in this contract</h2>
            <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-6 text-slate">We analyzed all standard clauses, including liability caps, termination clauses, governing law, and IP rights. All sections align with safe, industry-standard commercial terms.</p>

            <div className="mx-auto mt-7 max-w-[500px] rounded-lg border border-line bg-[#f8fafc] p-5 text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Passing checks</p>
              <ul className="mt-4 space-y-3 text-[13px] text-slate">
                <li className="flex items-center gap-2"><span className="font-bold text-green">✓</span> Indemnification parameters: Balanced</li>
                <li className="flex items-center gap-2"><span className="font-bold text-green">✓</span> Intellectual Property rules: Mutual</li>
                <li className="flex items-center gap-2"><span className="font-bold text-green">✓</span> Notice periods: Fair &gt; 30 Days</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}