export async function triggerHaptic(style: "light" | "medium" | "heavy" = "light") {
  if (typeof window === "undefined") return;
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return;
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    const map = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
    await Haptics.impact({ style: map[style] });
  } catch {
    /* web fallback — no-op */
  }
}

export async function secureSet(key: string, value: string) {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import("@capacitor/preferences");
      await Preferences.set({ key, value });
      return;
    }
  } catch {
    /* fall through */
  }
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, value);
  }
}

export async function secureGet(key: string): Promise<string | null> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import("@capacitor/preferences");
      const { value } = await Preferences.get({ key });
      return value;
    }
  } catch {
    /* fall through */
  }
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return null;
}

export function registerPushListeners(onPayload: (data: unknown) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    onPayload(detail);
  };
  window.addEventListener("resync:push", handler);
  return () => window.removeEventListener("resync:push", handler);
}
