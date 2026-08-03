export type RunStatus = "pending" | "running" | "passed" | "failed" | "error";

export interface TrendPoint {
  run_id: number;
  started_at: string;
  status: RunStatus;
  latency_ms: number | null;
}

export interface LatencyPoint {
  date: string;
  ms: number;
  status: RunStatus;
}

export interface Assertion {
  ok: boolean;
  text: string;
  detail: string;
}

export interface Turn {
  who: "user" | "agent";
  msg: string;
  ms?: number;
}

export interface TestCase {
  id: number;
  name: string;
  agent_ref: string;
  status: RunStatus;
  latency_ms: number;
  credits: number;
  pass_rate: number;
  trend: number[];
  transcript: Turn[];
  assertions: Assertion[];
}

export interface FailureBucket {
  key: string;
  name: string;
  count: number;
}

export interface Kpi {
  label: string;
  value: string;
  unit: string;
  delta: string;
  direction: "up" | "down" | "flat";
  accent?: boolean;
}

export interface DashboardData {
  agentId: string;
  agentOptions: string[];
  testCaseCount: number;
  lastRun: string;
  kpis: Kpi[];
  latency: LatencyPoint[];
  failures: FailureBucket[];
  testCases: TestCase[];
  /** True when the data is the built-in simulated dataset (no live backend reached). */
  demo: boolean;
}

/** Latency threshold (ms) a run must stay under to pass. Mirrors TestCase.max_latency_ms. */
export const LATENCY_THRESHOLD_MS = 1500;
