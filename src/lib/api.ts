const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://clauseguard-q5fk.onrender.com";

export type RunSummary = {
  run_id: string;
  status: string;
  contract_text: string;
  overall_verdict: string | null;
};

export type AdminMetrics = {
  total_analyses: number;
  analyses_today: number;
  unique_clients: number;
  completed_analyses: number;
  failed_analyses: number;
  risk_counts: Record<string, number>;
};

export type EvaluationMetrics = {
  model: string;
  retrieval_enabled: boolean;
  accuracy: number;
  mrr: number;
  ndcg: number;
  commit_hash: string;
};

async function request<T>(path: string, headers?: HeadersInit): Promise<T> {
  const response = await fetch(API_BASE_URL + path, { cache: "no-store", headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : "The ClauseGuard API request failed.";
    throw new Error(detail);
  }

  return data as T;
}

export const getHealth = () => request<{ status: string }>("/health");
export const getRuns = () => request<RunSummary[]>("/api/runs");
export const getRun = (runId: string) => request<RunSummary>("/api/runs/" + runId);
export const getLatestEvaluation = () => request<EvaluationMetrics>("/api/eval/latest");

export const getAdminMetrics = (token: string) => request<AdminMetrics>("/api/admin/metrics", { Authorization: "Bearer " + token });
