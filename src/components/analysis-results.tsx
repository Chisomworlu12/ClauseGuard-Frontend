import Image from "next/image";
import Link from "next/link";
import MobileMenu from "@/components/mobile-menu";
import SafeContractState from "@/components/safe-contract-state";

type Finding = {
  clause: string;
  risk: string;
  category: string;
  reason: string;
};

function parseReport(report: string) {
  const [findingsText, verdictText = ""] = report.split("OVERALL VERDICT");
  const findings = findingsText
    .split(/\n(?=Clause\s+\d+)/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("Clause "))
    .map((block): Finding | null => {
      const clause = block.match(/^Clause\s+(\d+)/)?.[1];
      const risk = block.match(/Risk:\s*([^\n]+)/)?.[1]?.trim();
      const category = block.match(/Category:\s*([^\n]+)/)?.[1]?.trim();
      const reason = block.match(/Reason:\s*([\s\S]*)/)?.[1]?.trim();

      if (!clause || !risk || !category || !reason) return null;
      return { clause, risk, category, reason };
    })
    .filter((finding): finding is Finding => finding !== null);

  return {
    findings,
    verdict: verdictText.split("Disclaimer:")[0].trim(),
  };
}

function displayCategory(category: string) {
  return category.replaceAll("_", " ");
}

export default function AnalysisResults({
  report,
  contractText,
  fileName,
}: {
  report: string;
  contractText: string;
  fileName?: string;
}) {
  const { findings, verdict } = parseReport(report);
  const isSafe = findings.length > 0
    ? findings.every((finding) => finding.risk.toLowerCase() === "low")
    : /no risky clauses|clean contract/i.test(report);

  if (isSafe) {
    return <SafeContractState fileName={fileName || "your contract"} />;
  }
  const highRiskCount = findings.filter((finding) => finding.risk.toLowerCase() === "high").length;
  const verdictLabel = highRiskCount > 0
    ? `Verdict: ${highRiskCount} high-risk clause${highRiskCount === 1 ? "" : "s"} found.`
    : "Verdict: Review the findings below before signing.";
  const previewText = contractText.length > 1100 ? `${contractText.slice(0, 1100)}...` : contractText;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line/80 bg-white">
        <div className="mx-auto flex h-19 max-w-330 items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="ClauseGuard home">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ink text-white shadow-sm"><Image src="/icon.png" alt="" width={24} height={24} className="h-6 w-6 rounded-md" /></span>
            <span className="text-[19px] font-bold tracking-[-0.04em]">ClauseGuard</span>
            <span className="hidden rounded-md border border-blue/20 bg-blue-pale px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue sm:inline-flex">Analyzer</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[14px] text-slate md:flex" aria-label="Main navigation">
            <Link className="font-semibold text-ink" href="/analyzer">New Scan</Link>
            <Link className="transition-colors hover:text-ink" href="/saved-contracts">Saved Contracts</Link>
            <span className="ml-1 h-8 w-px bg-line" aria-hidden="true" />
            <span className="rounded-full bg-[#eef2f7] px-3.5 py-2 text-xs font-semibold text-slate">CW</span>
          </nav>
          <MobileMenu items={[{ label: "New Scan", href: "/analyzer" }, { label: "Saved Contracts", href: "/saved-contracts" }]} />
        </div>
      </header>

      <div className="mx-auto max-w-330 px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex items-start gap-3.5 rounded-xl border border-line bg-white px-5 py-4 shadow-card sm:px-6">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff7e7] text-[#bd7b12]" aria-hidden="true">!</span>
          <p className="text-[13px] leading-6 text-slate sm:text-[14px]"><strong className="font-bold tracking-wide text-ink">LEGAL NOTICE:</strong>{" "}ClauseGuard provides an informational first-pass analysis, not professional legal advice, and does not create an attorney-client relationship.</p>
        </div>

        <section className="mt-8" aria-labelledby="results-title">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red/25 border-l-4 bg-[#fff3f3] px-5 py-4 text-[15px] font-semibold text-[#9f2424] shadow-card sm:px-6">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ef4444]" aria-hidden="true" />
            <h1 id="results-title" className="min-w-0 break-words">{verdictLabel}</h1>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
            <article className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-8">
              <div className="border-b border-line pb-4 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8da0bb]">
                {(fileName || "Contract text").toUpperCase()} (ACTIVE VIEW)
              </div>
              <p className="mt-6 whitespace-pre-wrap break-words font-serif text-[15px] leading-8 text-[#50627d]">{previewText}</p>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#f8fafc] px-4 py-3 text-[13px] text-slate">
                <span className="min-w-0 break-words flex items-center gap-2"><span className="text-green">✓</span>{Math.max(0, contractText.split(/\s+/).filter(Boolean).length)} words reviewed</span>
                <span className="shrink-0 text-muted">{findings.length} detection{findings.length === 1 ? "" : "s"}</span>
              </div>
            </article>

            <aside aria-label="Contract detections">
              <div className="mb-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8da0bb]">
                <span className="text-blue">⌁</span> Detections ({findings.length})
              </div>
              <div className="space-y-4">
                {findings.map((finding) => {
                  const isHigh = finding.risk.toLowerCase() === "high";
                  return (
                    <details key={finding.clause} className={["group rounded-xl border-l-4 border bg-white p-4 shadow-card", isHigh ? "border-l-red border-red/25" : "border-l-blue border-blue/25"].join(" ")}>
                      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.08em]">
                          <span className={isHigh ? "text-red" : "text-blue"}>{isHigh ? "● Critical risk" : "● Review"}</span>
                          <span className="text-muted">Clause {finding.clause}</span>
                        </div>
                        <span className="mt-2 block text-[14px] font-bold capitalize text-ink">{displayCategory(finding.category)} concern</span>
                        <span className="detection-preview mt-2 block text-[12px] leading-5 text-slate">{finding.reason}</span>
                        <span className="mt-3 block text-[11px] font-semibold text-blue group-open:hidden">View more</span>
                        <span className="mt-3 hidden text-[11px] font-semibold text-blue group-open:block">View less</span>
                      </summary>
                      <div className="mt-4 border-t border-line pt-4">
                        <p className="text-[13px] leading-6 text-slate">{finding.reason}</p>
                      </div>
                    </details>
                  );
                })}
              </div>
            </aside>
          </div>

          {verdict && <details className="mt-5 rounded-lg border border-line bg-white shadow-card">
            <summary className="cursor-pointer list-none px-5 py-4 text-[14px] font-semibold text-slate">Overall assessment</summary>
            <p className="border-t border-line px-5 py-4 text-[14px] leading-7 text-slate">{verdict}</p>
          </details>}
        </section>
      </div>
    </main>
  );
}