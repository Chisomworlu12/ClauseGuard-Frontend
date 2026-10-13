"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AdminMetrics, getAdminMetrics } from "@/lib/api";

const riskOrder = ["high", "medium", "low", "unable_to_assess"];

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadMetrics = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      setMetrics(await getAdminMetrics(token.trim()));
    } catch (cause) {
      setMetrics(null);
      setError(cause instanceof Error ? cause.message : "Unable to load the private dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!metrics) {
    return (
      <main className="min-h-screen bg-canvas px-5 py-12 text-ink sm:px-8">
        <div className="mx-auto max-w-[520px]">
          <Link href="/" className="text-sm font-bold text-ink">← ClauseGuard</Link>
          <section className="mt-12 rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue">Private workspace</p>
            <h1 className="mt-3 text-[30px] font-bold tracking-[-0.05em]">Admin analytics</h1>
            <p className="mt-3 text-sm leading-6 text-slate">Enter your admin access token to view aggregate ClauseGuard usage. Contract text and raw IP addresses are never shown here.</p>
            <form className="mt-7" onSubmit={loadMetrics}>
              <label htmlFor="admin-token" className="text-sm font-semibold text-ink">Admin access token</label>
              <input id="admin-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-lg border border-line bg-[#fbfcfe] px-4 py-3 text-base text-ink outline-none focus:border-blue focus:ring-4 focus:ring-blue/10 sm:text-sm" placeholder="Enter your private token" />
              {error && <p className="mt-3 text-sm leading-6 text-red" role="alert">{error}</p>}
              <button type="submit" disabled={!token.trim() || isLoading} className="mt-5 w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1c2942] disabled:cursor-not-allowed disabled:opacity-40">{isLoading ? "Checking access..." : "Open dashboard"}</button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  const maxRiskCount = Math.max(...riskOrder.map((risk) => metrics.risk_counts[risk] ?? 0), 1);

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line/80 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-[19px] font-bold tracking-[-0.04em]">ClauseGuard</Link>
          <span className="rounded-full bg-blue-pale px-3 py-1.5 text-xs font-semibold text-blue">Private admin</span>
        </div>
      </header>
      <section className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue">Private workspace</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-[34px] font-bold tracking-[-0.05em]">Usage overview</h1><p className="mt-2 text-sm text-slate">Aggregate product activity from your ClauseGuard database.</p></div>
          <button type="button" onClick={() => { setMetrics(null); setError(""); }} className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-slate hover:border-ink hover:text-ink">Lock dashboard</button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Total analyses", metrics.total_analyses], ["Analyses today", metrics.analyses_today], ["Unique clients", metrics.unique_clients], ["Completed", metrics.completed_analyses]].map(([label, value]) => <div key={label} className="rounded-xl border border-line bg-white p-5 shadow-card"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-3 text-3xl font-bold tracking-[-0.05em] text-ink">{value}</p></div>)}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-xl border border-line bg-white p-6 shadow-card" aria-labelledby="risk-title"><h2 id="risk-title" className="text-sm font-bold uppercase tracking-[0.08em]">Risk distribution</h2><div className="mt-6 space-y-5">{riskOrder.map((risk) => { const count = metrics.risk_counts[risk] ?? 0; return <div key={risk}><div className="flex justify-between text-sm"><span className="capitalize text-slate">{risk.replaceAll("_", " ")}</span><span className="font-semibold text-ink">{count}</span></div><div className="mt-2 h-2 rounded-full bg-[#eef2f7]"><div className={risk === "high" ? "h-2 rounded-full bg-red" : "h-2 rounded-full bg-blue"} style={{ width: `${(count / maxRiskCount) * 100}%` }} /></div></div>; })}</div></section>
          <section className="rounded-xl border border-line bg-white p-6 shadow-card" aria-labelledby="status-title"><h2 id="status-title" className="text-sm font-bold uppercase tracking-[0.08em]">Run status</h2><div className="mt-6 space-y-4 text-sm"><div className="flex justify-between"><span className="text-slate">Completed analyses</span><strong>{metrics.completed_analyses}</strong></div><div className="flex justify-between"><span className="text-slate">Failed analyses</span><strong className="text-red">{metrics.failed_analyses}</strong></div><div className="flex justify-between"><span className="text-slate">Tracked unique clients</span><strong>{metrics.unique_clients}</strong></div></div></section>
        </div>
      </section>
    </main>
  );
}