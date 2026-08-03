import type { FailureBucket } from "../types";

export default function FailureBreakdown({ items }: { items: FailureBucket[] }) {
  const max = Math.max(...items.map((f) => f.count), 1);
  const total = items.reduce((sum, f) => sum + f.count, 0);

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Failures by cause</h2>
          <p className="hint">Last 30 days · {total} failed runs</p>
        </div>
      </div>
      <div className="fbars">
        {items.map((f) => (
          <div className="fbar" key={f.key}>
            <div className="fb-top">
              <span className="fb-name">{f.name}</span>
              <span className="fb-n">{f.count}</span>
            </div>
            <div className="track">
              <div className="fill" style={{ width: `${(f.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
