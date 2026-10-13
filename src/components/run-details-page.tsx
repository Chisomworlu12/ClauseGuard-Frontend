"use client";

import { useEffect, useState } from "react";
import AnalysisResults from "@/components/analysis-results";
import { getRun, RunSummary } from "@/lib/api";

export default function RunDetailsPage({ runId }: { runId: string }) {
  const [run, setRun] = useState<RunSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (runId) {
      getRun(runId)
        .then(setRun)
        .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load this run."));
    }
  }, [runId]);

  if (error) {
    return <main className="min-h-screen bg-canvas px-5 py-12 text-ink"><div className="mx-auto max-w-[1000px] rounded-xl border border-red/20 bg-red/5 p-5 text-sm text-red" role="alert">{error}</div></main>;
  }

  if (!run) {
    return <main className="min-h-screen bg-canvas px-5 py-12 text-sm text-slate"><div className="mx-auto max-w-[1000px]">Loading analysis results...</div></main>;
  }

  return <AnalysisResults report={run.overall_verdict ?? "The saved analysis has no report."} contractText={run.contract_text} />;
}