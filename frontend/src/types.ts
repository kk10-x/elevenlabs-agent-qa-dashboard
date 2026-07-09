export type RunStatus = "pending" | "running" | "passed" | "failed" | "error";

export interface TrendPoint {
  run_id: number;
  started_at: string;
  status: RunStatus;
  latency_ms: number | null;
}

export interface TestCase {
  id: number;
  name: string;
  agent_id: string;
}
