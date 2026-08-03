import { useEffect, useState } from "react";

import { loadDashboard } from "../api";
import type { DashboardData } from "../types";
import FailureBreakdown from "./FailureBreakdown";
import Kpis from "./Kpis";
import LatencyChart from "./LatencyChart";
import RunDrawer from "./RunDrawer";
import TestCaseTable from "./TestCaseTable";

function useTheme(): [string | null, () => void] {
  const [theme, setTheme] = useState<string | null>(null);
  const toggle = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = theme ?? (prefersDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  };
  return [theme, toggle];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    loadDashboard().then(setData);
  }, []);

  if (!data) {
    return <p className="foot">Loading dashboard…</p>;
  }

  const selected = data.testCases.find((t) => t.id === selectedId) ?? null;
  const themeLabel = theme === "dark" ? "Light" : theme === "light" ? "Dark" : "Theme";

  const runAll = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 1600);
  };

  return (
    <>
      <div className="topbar">
        <div className="brand">
          <div className="mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.1} strokeLinecap="round">
              <path d="M4 12h2M9 12h1.5M14 12h1.5M20 12h0" />
              <path d="M6.5 8v8M11 5v14M15.5 8.5v7M20 10.5v3" />
            </svg>
          </div>
          <div>
            <h1>Agent QA &amp; Observability</h1>
            <p className="sub">Catch tone, latency &amp; tool-calling regressions before production</p>
          </div>
        </div>
        {data.demo && (
          <span className="demo-badge" title="Static demo — data is simulated, no ElevenLabs API is called.">
            Demo · simulated data
          </span>
        )}
        <button className="ctl" onClick={toggleTheme} title="Toggle light / dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </svg>
          {themeLabel}
        </button>
      </div>

      <div className="agentline">
        <select className="ctl" aria-label="Select agent" defaultValue={data.agentOptions[0]}>
          {data.agentOptions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <span className="aid">agent_id: {data.agentId}</span>
        <span className="aid">
          <span className="live-dot" /> {data.testCaseCount} test cases
        </span>
        <span className="aid">last run · {data.lastRun}</span>
        <button className="ctl" style={{ marginLeft: "auto" }} onClick={runAll} disabled={running}>
          {running ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
              </svg>
              Running…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              Run all test cases
            </>
          )}
        </button>
      </div>

      <Kpis items={data.kpis} />

      <div className="grid2">
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Response latency over time</h2>
              <p className="hint">Per-run p95 agent latency · threshold 1500&nbsp;ms</p>
            </div>
            <div className="legend">
              <span>
                <span className="swatch line" style={{ background: "var(--accent)" }} /> latency
              </span>
              <span>
                <span className="swatch" style={{ background: "var(--pass)" }} /> pass
              </span>
              <span>
                <span className="swatch" style={{ background: "var(--fail)" }} /> fail
              </span>
            </div>
          </div>
          <LatencyChart data={data.latency} />
        </div>
        <FailureBreakdown items={data.failures} />
      </div>

      <TestCaseTable
        cases={data.testCases}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(selectedId === id ? null : id)}
      />

      {selected && <RunDrawer tc={selected} />}

      <p className="foot">
        Static demo of the <b>ElevenLabs Agent QA &amp; Observability Dashboard</b>. All numbers are simulated — no{" "}
        <code>ELEVENLABS_API_KEY</code>, agent, or database is required.
        <br />
        The real app pairs a FastAPI + Postgres backend with this React dashboard to run test cases against live agents.
      </p>
    </>
  );
}
