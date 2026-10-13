"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EvaluationMetrics, getLatestEvaluation } from "@/lib/api";

export default function EvaluationPage() {
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getLatestEvaluation().then(setMetrics).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load evaluation metrics."));
  }, []);

  return <main className="min-h-screen bg-canvas text-ink"><header className="border-b border-line/80 bg-white"><div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8"><Link href="/" className="text-[19px] font-bold tracking-[-0.04em]">ClauseGuard</Link><Link href="/analyzer" className="rounded-lg bg-ink px-4 py-2.5 text-[13px] font-semibold text-white">New scan</Link></div></header><section className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue">System evaluation</p><h1 className="mt-3 text-[36px] font-bold tracking-[-0.05em]">Latest evaluation</h1>{error && <div role="alert" className="mt-8 rounded-xl border border-red/20 bg-red/5 p-5 text-sm text-red">{error}</div>}{!metrics && !error && <p className="mt-8 text-sm text-slate">Loading evaluation...</p>}{metrics && <div className="mt-8 rounded-xl border border-line bg-white p-6 shadow-card"><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-lg bg-[#f8fafc] p-5"><p className="text-xs text-muted">Accuracy</p><p className="mt-2 text-3xl font-bold">{(metrics.accuracy * 100).toFixed(1)}%</p></div><div className="rounded-lg bg-[#f8fafc] p-5"><p className="text-xs text-muted">MRR</p><p className="mt-2 text-3xl font-bold">{metrics.mrr.toFixed(3)}</p></div><div className="rounded-lg bg-[#f8fafc] p-5"><p className="text-xs text-muted">nDCG</p><p className="mt-2 text-3xl font-bold">{metrics.ndcg.toFixed(3)}</p></div></div><dl className="mt-6 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2"><div><dt className="text-muted">Model</dt><dd className="mt-1 font-semibold">{metrics.model}</dd></div><div><dt className="text-muted">Retrieval enabled</dt><dd className="mt-1 font-semibold">{metrics.retrieval_enabled ? "Yes" : "No"}</dd></div><div><dt className="text-muted">Commit</dt><dd className="mt-1 break-all font-mono text-xs">{metrics.commit_hash}</dd></div></dl></div>}</section></main>;
}
