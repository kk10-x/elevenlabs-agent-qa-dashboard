export default function Sparkline({ values }: { values: number[] }) {
  const w = 96;
  const h = 26;
  const mn = Math.min(...values);
  const mx = Math.max(...values);
  const rng = mx - mn || 1;
  const y = (v: number) => h - 3 - ((v - mn) / rng) * (h - 6);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${y(v)}`).join(" ");
  const last = values[values.length - 1];

  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.85}
      />
      <circle cx={w} cy={y(last)} r={2.4} fill="var(--accent)" />
    </svg>
  );
}
