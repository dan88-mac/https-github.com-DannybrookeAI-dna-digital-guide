import { cn } from "@/lib/utils";

const items = [
  { label: "Executions (24h)", value: "1,284", delta: "+12%", tone: "text-emerald-400" },
  { label: "Self-heal rate", value: "94.2%", delta: "+3.1%", tone: "text-emerald-400" },
  { label: "Credits used", value: "3,420", delta: "68% of plan", tone: "text-amber-400" },
  { label: "Saved workflows", value: "18", delta: "2 drafts offline", tone: "text-indigo-300" },
];

export function MetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-zinc-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
          <p className={cn("mt-1 text-xs", item.tone)}>{item.delta}</p>
        </div>
      ))}
    </div>
  );
}
