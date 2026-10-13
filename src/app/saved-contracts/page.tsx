"use client";

import Link from "next/link";
import MobileMenu from "@/components/mobile-menu";
import { useEffect, useState } from "react";
import { getRuns, RunSummary } from "@/lib/api";

export default function SavedContractsPage() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRuns().then(setRuns).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load saved contracts.")).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line/80 bg-white"><div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8"><Link href="/" className="text-[19px] font-bold tracking-[-0.04em]">ClauseGuard</Link><Link href="/analyzer" className="rounded-lg bg-ink px-4 py-2.5 text-[13px] font-semibold text-white">New scan</Link><MobileMenu items={[{ label: "New Scan", href: "/analyzer" }, { label: "Evaluation", href: "/evaluation" }]} /></div></header>
      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue">Workspace</p><h1 className="mt-3 break-words text-[36px] font-bold tracking-[-0.05em]">Saved contracts</h1><p className="mt-3 text-[15px] text-slate">Review contracts previously submitted to ClauseGuard.</p>
        {loading && <div className="mt-10 rounded-xl border border-line bg-white p-8 text-sm text-slate">Loading saved contracts...</div>}
        {error && <div role="alert" className="mt-10 rounded-xl border border-red/20 bg-red/5 p-5 text-sm text-red">{error}</div>}
        {!loading && !error && runs.length === 0 && <div className="mt-10 rounded-xl border border-line bg-white p-10 text-center shadow-card"><h2 className="text-xl font-bold">No saved contracts yet</h2><p className="mt-2 text-sm text-slate">Start your first scan to see it here.</p><Link href="/analyzer" className="mt-6 inline-flex rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white">Analyze a contract</Link></div>}
        {!loading && !error && runs.length > 0 && <div className="mt-10 grid gap-4">{runs.map((run) => <Link key={run.run_id} href={"/runs/" + run.run_id} className="rounded-xl border border-line bg-white p-5 shadow-card transition-colors hover:border-blue"><div className="flex flex-wrap items-center justify-between gap-3"><span className="min-w-0 break-words text-sm font-semibold text-ink">{run.contract_text.slice(0, 100) || "Untitled contract"}</span><span className="shrink-0 rounded-full bg-blue-pale px-3 py-1 text-xs font-semibold text-blue">{run.status}</span></div><p className="mt-3 text-xs text-muted">Run ID: {run.run_id}</p></Link>)}</div>}
      </section>
    </main>
  );
}
