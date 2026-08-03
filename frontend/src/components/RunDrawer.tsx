import { LATENCY_THRESHOLD_MS, type TestCase } from "../types";

function CheckIcon({ ok }: { ok: boolean }) {
  return (
    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke={ok ? "var(--pass)" : "var(--fail)"} strokeWidth={2.4} aria-hidden="true">
      <circle cx="12" cy="12" r="9" strokeOpacity="0.35" />
      {ok ? <path d="M8 12.5l2.5 2.5L16 9" /> : <path d="M15 9l-6 6M9 9l6 6" />}
    </svg>
  );
}

export default function RunDrawer({ tc }: { tc: TestCase }) {
  const passN = tc.assertions.filter((a) => a.ok).length;

  return (
    <div className="drawer">
      <div className="drawer-head">
        <span className={`pill ${tc.status}`}>
          <span className="d" />
          {tc.status}
        </span>
        <span className="dh-name">{tc.name}</span>
        <div className="meta">
          <span>
            assertions{" "}
            <b>
              {passN}/{tc.assertions.length}
            </b>
          </span>
          <span>
            p95 <b>{tc.latency_ms} ms</b>
          </span>
          <span>
            credits <b>{tc.credits}</b>
          </span>
          <span>
            conv_id <b>cnv_{tc.agent_ref.slice(3, 9)}</b>
          </span>
        </div>
      </div>
      <div className="drawer-body">
        <div className="transcript">
          <p className="sec-label">Simulated transcript</p>
          {tc.transcript.map((t, i) => {
            const slow = t.ms != null && t.ms > LATENCY_THRESHOLD_MS;
            return (
              <div className={`turn ${t.who}`} key={i}>
                <div className="who">{t.who}</div>
                <div>
                  <div className="msg">{t.msg}</div>
                  {t.ms != null && (
                    <div className={slow ? "lat slow" : "lat"}>
                      ↳ {t.ms} ms{slow ? " · over threshold" : ""}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="assertions">
          <p className="sec-label">Assertions</p>
          {tc.assertions.map((a, i) => (
            <div className={a.ok ? "assert ok" : "assert bad"} key={i}>
              <CheckIcon ok={a.ok} />
              <div>
                <div className="atext">{a.text}</div>
                <div className="adet">{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
