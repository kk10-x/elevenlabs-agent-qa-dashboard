import { MOCK_DASHBOARD } from "./mockData";
import type { DashboardData } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

/**
 * Load dashboard data. Attempts the live backend first and transparently falls
 * back to the built-in simulated dataset when it is unreachable — so the exact
 * same build runs against a real FastAPI backend in dev and as a static demo on
 * a host with no backend at all.
 *
 * The `/dashboard` aggregate endpoint is the seam for the real backend; until it
 * exists the fetch simply fails and the demo dataset is served.
 */
export async function loadDashboard(): Promise<DashboardData> {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as DashboardData;
    return { ...data, demo: false };
  } catch {
    return MOCK_DASHBOARD;
  }
}
