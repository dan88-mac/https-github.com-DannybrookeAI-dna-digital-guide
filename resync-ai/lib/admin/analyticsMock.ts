/** Deterministic demo analytics — replace with Supabase rollups when wired */

export interface AnalyticsSnapshot {
  checkedAt: string;
  visits24h: number;
  uniqueVisitors24h: number;
  pendingSubscribers: number;
  completedFlows: number;
  activeSessions: number;
  healSuccessRate: number;
  topPaths: { path: string; hits: number }[];
  funnel: { stage: string; count: number }[];
}

export function getAnalyticsSnapshot(): AnalyticsSnapshot {
  const day = new Date().toISOString().slice(0, 10);
  let seed = 0;
  for (let i = 0; i < day.length; i++) seed = (seed * 31 + day.charCodeAt(i)) >>> 0;
  const r = (n: number) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed % n;
  };

  return {
    checkedAt: new Date().toISOString(),
    visits24h: 1200 + r(800),
    uniqueVisitors24h: 400 + r(300),
    pendingSubscribers: 8 + r(40),
    completedFlows: 90 + r(200),
    activeSessions: 12 + r(40),
    healSuccessRate: 0.86 + r(12) / 100,
    topPaths: [
      { path: "/", hits: 500 + r(200) },
      { path: "/pricing", hits: 180 + r(80) },
      { path: "/studio", hits: 140 + r(60) },
      { path: "/community", hits: 110 + r(50) },
      { path: "/builder", hits: 95 + r(40) },
    ],
    funnel: [
      { stage: "Landing view", count: 1000 + r(200) },
      { stage: "Pricing view", count: 420 + r(80) },
      { stage: "Signup start", count: 160 + r(40) },
      { stage: "Checkout", count: 48 + r(20) },
      { stage: "Active paid", count: 28 + r(12) },
    ],
  };
}
