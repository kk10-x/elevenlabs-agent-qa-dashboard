import type { Kpi } from "../types";

function arrow(direction: Kpi["direction"]): string {
  if (direction === "up") return "▲";
  if (direction === "down") return "▼";
  return "•";
}

export default function Kpis({ items }: { items: Kpi[] }) {
  return (
    <div className="kpis">
      {items.map((k) => (
        <div className={k.accent ? "kpi accentbar" : "kpi"} key={k.label}>
          <div className="k-label">{k.label}</div>
          <div className="k-val">
            {k.value}
            <small>{k.unit}</small>
          </div>
          <div className={`k-delta ${k.direction}`}>
            {arrow(k.direction)} {k.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
