export function ReducedMotionFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-indigo-950/40 via-resync-bg to-resync-bg"
      aria-hidden
    />
  );
}
