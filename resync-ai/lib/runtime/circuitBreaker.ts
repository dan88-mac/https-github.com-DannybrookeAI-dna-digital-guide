const state = new Map<string, { failures: number; openedUntil: number }>();

const WINDOW_MS = 5 * 60 * 1000;
const MAX_FAILURES = 5;

export function isCircuitOpen(orgId: string, endpoint: string): boolean {
  const key = `${orgId}:${endpoint}`;
  const entry = state.get(key);
  if (!entry) return false;
  if (Date.now() < entry.openedUntil) return true;
  if (entry.openedUntil > 0 && Date.now() >= entry.openedUntil) {
    state.delete(key);
  }
  return false;
}

export function recordFailure(orgId: string, endpoint: string): void {
  const key = `${orgId}:${endpoint}`;
  const entry = state.get(key) ?? { failures: 0, openedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= MAX_FAILURES) {
    entry.openedUntil = Date.now() + WINDOW_MS;
    entry.failures = 0;
  }
  state.set(key, entry);
}

export function recordSuccess(orgId: string, endpoint: string): void {
  state.delete(`${orgId}:${endpoint}`);
}

export function isPrivateUrl(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    const host = u.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return true;
    if (/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
    return false;
  } catch {
    return true;
  }
}
