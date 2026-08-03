import type { TestCase } from "../types";
import Sparkline from "./Sparkline";

interface Props {
  cases: TestCase[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function TestCaseTable({ cases, selectedId, onSelect }: Props) {
  return (
    <div className="card tbl-card">
      <div className="card-head">
        <div>
          <h2>Test cases</h2>
          <p className="hint">Click a row to inspect the latest run transcript &amp; assertions</p>
        </div>
      </div>
      <div className="tbl-scroll">
        <table>
          <thead>
            <tr>
              <th>Test case</th>
              <th>Last status</th>
              <th className="num">Latency</th>
              <th className="num">Credits</th>
              <th>Recent runs</th>
              <th className="num">Pass rate</th>
              <th aria-label="Expand" />
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className={selectedId === c.id ? "sel" : undefined} onClick={() => onSelect(c.id)}>
                <td>
                  <div className="tc-name">{c.name}</div>
                  <div className="tc-aid">{c.agent_ref}</div>
                </td>
                <td>
                  <span className={`pill ${c.status}`}>
                    <span className="d" />
                    {c.status}
                  </span>
                </td>
                <td className="num">{c.latency_ms} ms</td>
                <td className="num">{c.credits}</td>
                <td>
                  <Sparkline values={c.trend} />
                </td>
                <td className="num">{Math.round(c.pass_rate * 100)}%</td>
                <td>
                  <svg
                    className="chev"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
