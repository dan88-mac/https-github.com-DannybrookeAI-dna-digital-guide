import { cn } from "@/lib/utils";

export function RefinementBadge({
  score,
  grade,
  size = "sm",
}: {
  score: number;
  grade: string;
  size?: "sm" | "md";
}) {
  if (grade === "—") return null;

  const color =
    score >= 80
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      : score >= 70
        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
        : "border-zinc-500/40 bg-zinc-500/10 text-zinc-400";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        color,
        size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs",
      )}
      title={`Refinement score: ${score}/100`}
    >
      <span className="font-semibold">{grade}</span>
      <span className="opacity-70">{score}</span>
    </span>
  );
}
