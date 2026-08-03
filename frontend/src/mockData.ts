import type { DashboardData } from "./types";

/**
 * Built-in simulated dataset. Used when no live backend is reachable — which is
 * always the case for the static hosted demo (GitHub Pages, Netlify, etc.), since
 * there is no `/api` to answer. The shape matches what the FastAPI backend is
 * expected to aggregate, so swapping in real data is a drop-in replacement.
 */
export const MOCK_DASHBOARD: DashboardData = {
  agentId: "7Qk2f8Lx9pRs",
  agentOptions: ["support-agent-v3", "support-agent-v2", "booking-concierge"],
  testCaseCount: 5,
  lastRun: "2h ago",
  demo: true,

  kpis: [
    { label: "Pass rate", value: "86", unit: "%", delta: "+4 pts vs last wk", direction: "up", accent: true },
    { label: "Total runs", value: "72", unit: "", delta: "14 this week", direction: "flat" },
    { label: "Failed runs", value: "10", unit: "", delta: "+2 vs last wk", direction: "down" },
    { label: "p95 latency", value: "1180", unit: "ms", delta: "-120 ms vs last wk", direction: "up" },
    { label: "Credits used", value: "3.1", unit: "k", delta: "of 8k budget", direction: "flat" },
  ],

  latency: [
    { date: "Jul 01", ms: 820, status: "passed" },
    { date: "Jul 03", ms: 910, status: "passed" },
    { date: "Jul 05", ms: 780, status: "passed" },
    { date: "Jul 08", ms: 1010, status: "passed" },
    { date: "Jul 10", ms: 2380, status: "failed" },
    { date: "Jul 12", ms: 940, status: "passed" },
    { date: "Jul 15", ms: 880, status: "passed" },
    { date: "Jul 17", ms: 1120, status: "passed" },
    { date: "Jul 19", ms: 2110, status: "failed" },
    { date: "Jul 22", ms: 970, status: "passed" },
    { date: "Jul 24", ms: 900, status: "passed" },
    { date: "Jul 26", ms: 1480, status: "passed" },
    { date: "Jul 29", ms: 2540, status: "failed" },
    { date: "Aug 01", ms: 860, status: "passed" },
  ],

  failures: [
    { key: "latency_spike", name: "Latency spike", count: 5 },
    { key: "wrong_response", name: "Wrong response", count: 3 },
    { key: "interruption_mishandled", name: "Interruption mishandled", count: 2 },
  ],

  testCases: [
    {
      id: 1,
      name: "Refund flow — stays polite under pressure",
      agent_ref: "tc_refund_polite",
      status: "passed",
      latency_ms: 860,
      credits: 42,
      pass_rate: 0.94,
      trend: [820, 900, 780, 1010, 880, 940, 860],
      transcript: [
        { who: "user", msg: "This is the third time I'm calling. I want my money back NOW." },
        {
          who: "agent",
          msg: "I completely understand the frustration, and I'm sorry it's taken this long. Let me pull up your order and start the refund right away.",
          ms: 780,
        },
        { who: "user", msg: "It's order 5591. And don't put me on hold again." },
        {
          who: "agent",
          msg: "Thank you — I've got order 5591 here. I'm processing a full refund of $48.00 to your original card now; you'll see it in 3-5 business days.",
          ms: 910,
        },
      ],
      assertions: [
        { ok: true, text: "Tone stays empathetic under hostile input", detail: "sentiment: calm/empathetic across 2 turns" },
        { ok: true, text: "Refund tool called with correct order id", detail: "issue_refund(order=5591)" },
        { ok: true, text: "No hold / transfer promised after opt-out", detail: "no 'hold' token after user request" },
        { ok: true, text: "p95 latency under 1500 ms", detail: "p95 = 910 ms" },
      ],
    },
    {
      id: 2,
      name: "Order status — no hallucinated order IDs",
      agent_ref: "tc_order_no_hallucination",
      status: "failed",
      latency_ms: 2110,
      credits: 55,
      pass_rate: 0.71,
      trend: [900, 1120, 980, 2110, 1040, 2540, 2110],
      transcript: [
        { who: "user", msg: "Can you check where my package is?" },
        { who: "agent", msg: "Of course — could you share your order number so I can look that up?", ms: 640 },
        { who: "user", msg: "I don't have it in front of me." },
        { who: "agent", msg: "No problem, it looks like order 8842 shipped yesterday and arrives Thursday.", ms: 2110 },
      ],
      assertions: [
        { ok: true, text: "Asks for order id before lookup", detail: "prompt for identifier" },
        { ok: false, text: "Never invents an order id", detail: "hallucinated order 8842 — no id was provided" },
        { ok: false, text: "p95 latency under 1500 ms", detail: "p95 = 2110 ms · +610 over threshold" },
        { ok: true, text: "Does not expose other customers' data", detail: "no PII leak detected" },
      ],
    },
    {
      id: 3,
      name: "Interruption — resumes cleanly after barge-in",
      agent_ref: "tc_interruption_resume",
      status: "passed",
      latency_ms: 940,
      credits: 38,
      pass_rate: 0.88,
      trend: [1010, 880, 2380, 940, 900, 960, 940],
      transcript: [
        { who: "agent", msg: "Your subscription renews on the 14th and the plan includes—", ms: 700 },
        { who: "user", msg: "[interrupts] wait, how much is it?" },
        {
          who: "agent",
          msg: "It's $12 a month. As I was saying, the plan also includes priority support if you'd like to keep it.",
          ms: 940,
        },
      ],
      assertions: [
        { ok: true, text: "Yields immediately on barge-in", detail: "stop latency = 180 ms" },
        { ok: true, text: "Answers the interrupting question first", detail: "price answered before resume" },
        { ok: true, text: "Resumes the dropped thread", detail: "'as I was saying' continuation" },
        { ok: true, text: "p95 latency under 1500 ms", detail: "p95 = 940 ms" },
      ],
    },
    {
      id: 4,
      name: "Escalation — hands off within 2 turns",
      agent_ref: "tc_escalation_handoff",
      status: "passed",
      latency_ms: 1120,
      credits: 47,
      pass_rate: 0.9,
      trend: [980, 1120, 1040, 1100, 1180, 1120, 1120],
      transcript: [
        { who: "user", msg: "I need to speak to a human about a billing dispute." },
        {
          who: "agent",
          msg: "Absolutely — this needs a specialist. I'm connecting you to our billing team now and passing along your account details so you won't have to repeat yourself.",
          ms: 1120,
        },
      ],
      assertions: [
        { ok: true, text: "Recognizes escalation intent", detail: "intent: human_handoff" },
        { ok: true, text: "Transfers within 2 turns", detail: "handoff at turn 1" },
        { ok: true, text: "Passes context to human agent", detail: "transfer_call(context=…)" },
        { ok: true, text: "p95 latency under 1500 ms", detail: "p95 = 1120 ms" },
      ],
    },
    {
      id: 5,
      name: "Small talk — no policy over-promising",
      agent_ref: "tc_no_overpromise",
      status: "passed",
      latency_ms: 830,
      credits: 31,
      pass_rate: 0.97,
      trend: [800, 860, 820, 840, 810, 850, 830],
      transcript: [
        { who: "user", msg: "You guys are great! Can you give me free shipping forever?" },
        {
          who: "agent",
          msg: "That's kind of you! I can't promise free shipping forever, but I can add free shipping to today's order — want me to do that?",
          ms: 830,
        },
      ],
      assertions: [
        { ok: true, text: "Declines commitments outside policy", detail: "no unlimited promise" },
        { ok: true, text: "Offers a compliant alternative", detail: "one-time free shipping offered" },
        { ok: true, text: "Stays friendly", detail: "sentiment: warm" },
        { ok: true, text: "p95 latency under 1500 ms", detail: "p95 = 830 ms" },
      ],
    },
  ],
};
