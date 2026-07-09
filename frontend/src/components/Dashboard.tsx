import { useEffect, useState } from "react";

import type { TrendPoint } from "../types";
import TrendChart from "./TrendChart";

// Placeholder data until the backend runner + /runs/{id}/history endpoint is wired up.
const MOCK_HISTORY: TrendPoint[] = [
  { run_id: 1, started_at: "2026-07-01T10:00:00Z", status: "passed", latency_ms: 820 },
  { run_id: 2, started_at: "2026-07-03T10:00:00Z", status: "passed", latency_ms: 910 },
  { run_id: 3, started_at: "2026-07-05T10:00:00Z", status: "failed", latency_ms: 2400 },
  { run_id: 4, started_at: "2026-07-07T10:00:00Z", status: "passed", latency_ms: 870 },
];

export default function Dashboard() {
  const [history, setHistory] = useState<TrendPoint[]>(MOCK_HISTORY);

  useEffect(() => {
    fetch("/api/runs/1/history")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setHistory)
      .catch(() => setHistory(MOCK_HISTORY));
  }, []);

  const passed = history.filter((r) => r.status === "passed").length;
  const failed = history.filter((r) => r.status === "failed").length;

  return (
    <section>
      <div className="summary-row">
        <div className="stat-tile passed">
          <div className="value">{passed}</div>
          <div className="label">Passed</div>
        </div>
        <div className="stat-tile failed">
          <div className="value">{failed}</div>
          <div className="label">Failed</div>
        </div>
      </div>
      <TrendChart history={history} />
    </section>
  );
}
