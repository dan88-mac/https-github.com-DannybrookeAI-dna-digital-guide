const SECRET_KEYS = /key|secret|token|password|auth/i;
const BEARER = /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi;

export function maskSecret(value: string): string {
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}${"*".repeat(value.length - 4)}${value.slice(-2)}`;
}

export function scrubHybridPayload<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map((x) => scrubHybridPayload(x)) as T;
  }
  if (typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (SECRET_KEYS.test(k) && typeof v === "string") {
        out[k] = maskSecret(v);
      } else {
        out[k] = scrubHybridPayload(v);
      }
    }
    return out as T;
  }
  if (typeof data === "string") {
    return data.replace(BEARER, "Bearer ****") as T;
  }
  return data;
}
