import { useEffect, useRef, useState } from "react";

import { LATENCY_THRESHOLD_MS, type LatencyPoint } from "../types";

const H = 260;
const M = { t: 14, r: 14, b: 26, l: 42 };
const MAX_Y = 2800;
const Y_TICKS = [0, 700, 1400, 2100, 2800];

export default function LatencyChart({ data }: { data: LatencyPoint[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const iw = w - M.l - M.r;
  const ih = H - M.t - M.b;
  const xs = (i: number) => M.l + (data.length <= 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const ys = (v: number) => M.t + ih - (v / MAX_Y) * ih;

  const linePath = data.map((p, i) => `${i ? "L" : "M"}${xs(i)} ${ys(p.ms)}`).join(" ");
  const areaPath = `${linePath} L${xs(data.length - 1)} ${ys(0)} L${xs(0)} ${ys(0)} Z`;
  const threshY = ys(LATENCY_THRESHOLD_MS);

  return (
    <div className="chart-box" ref={boxRef}>
      <svg className="chart" role="img" aria-label="Per-run latency trend" width="100%" height={H}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Y_TICKS.map((g) => (
          <g key={g}>
            <line x1={M.l} y1={ys(g)} x2={M.l + iw} y2={ys(g)} stroke="var(--grid)" strokeWidth={1} />
            <text x={M.l - 8} y={ys(g) + 3.5} textAnchor="end" fontSize={10} fill="var(--ink-3)">
              {g}
            </text>
          </g>
        ))}

        <line
          x1={M.l}
          y1={threshY}
          x2={M.l + iw}
          y2={threshY}
          stroke="var(--fail)"
          strokeWidth={1.4}
          strokeDasharray="5 4"
          opacity={0.7}
        />
        <text x={M.l + iw} y={threshY - 6} textAnchor="end" fontSize={10} fill="var(--fail)" fontWeight={600}>
          {LATENCY_THRESHOLD_MS} ms threshold
        </text>

        <path d={areaPath} fill="url(#areaGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((p, i) =>
          i % 2 === 0 || i === data.length - 1 ? (
            <text key={`x-${i}`} x={xs(i)} y={H - 8} textAnchor="middle" fontSize={9.5} fill="var(--ink-3)">
              {p.date}
            </text>
          ) : null,
        )}

        {data.map((p, i) => {
          const fail = p.status === "failed";
          const color = fail ? "var(--fail)" : "var(--pass)";
          return (
            <g key={`pt-${i}`}>
              <circle
                cx={xs(i)}
                cy={ys(p.ms)}
                r={fail ? 6 : 4.6}
                fill="var(--panel)"
                stroke={color}
                strokeWidth={fail ? 2.4 : 2}
              />
              {fail && <circle cx={xs(i)} cy={ys(p.ms)} r={2} fill={color} />}
              <circle
                cx={xs(i)}
                cy={ys(p.ms)}
                r={16}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div className="tt" style={{ left: xs(hover), top: ys(data[hover].ms), opacity: 1 }}>
          <b>{data[hover].ms} ms</b>
          {" · "}
          <span
            className="tt-st"
            style={{ color: data[hover].status === "failed" ? "var(--fail)" : "var(--pass)" }}
          >
            {data[hover].status}
          </span>
          <br />
          {data[hover].date}
        </div>
      )}
    </div>
  );
}
