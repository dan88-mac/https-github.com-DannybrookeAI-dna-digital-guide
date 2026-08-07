"use client";

import { useMemo, useState } from "react";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/**
 * Interactive ROI / savings estimator. Pure client-side math — no backend
 * required. Estimates yearly savings from automating manual workflow runs and
 * reclaiming engineering time from self-healing incidents.
 */
export function RoiCalculator() {
  const [runsPerWeek, setRunsPerWeek] = useState(400);
  const [minutesPerRun, setMinutesPerRun] = useState(6);
  const [hourlyCost, setHourlyCost] = useState(65);
  const [incidentsPerMonth, setIncidentsPerMonth] = useState(12);

  const result = useMemo(() => {
    const manualHoursPerYear = (runsPerWeek * minutesPerRun * 52) / 60;
    const manualSavings = manualHoursPerYear * hourlyCost;
    // Self-heal reclaims ~45 min of eng time per incident it resolves,
    // and resolves ~70% automatically.
    const incidentHoursPerYear = incidentsPerMonth * 12 * 0.7 * 0.75;
    const incidentSavings = incidentHoursPerYear * hourlyCost;
    const total = manualSavings + incidentSavings;
    return {
      manualHoursPerYear,
      manualSavings,
      incidentHoursPerYear,
      incidentSavings,
      total,
    };
  }, [runsPerWeek, minutesPerRun, hourlyCost, incidentsPerMonth]);

  const fields: Array<{
    label: string;
    value: number;
    set: (n: number) => void;
    min: number;
    max: number;
    step: number;
    suffix?: string;
  }> = [
    { label: "Workflow runs / week", value: runsPerWeek, set: setRunsPerWeek, min: 10, max: 5000, step: 10 },
    { label: "Manual minutes / run", value: minutesPerRun, set: setMinutesPerRun, min: 1, max: 60, step: 1 },
    { label: "Loaded hourly cost", value: hourlyCost, set: setHourlyCost, min: 20, max: 200, step: 5, suffix: "$" },
    { label: "Incidents / month", value: incidentsPerMonth, set: setIncidentsPerMonth, min: 0, max: 200, step: 1 },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6 rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6">
        {fields.map((f) => (
          <div key={f.label}>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-300">{f.label}</label>
              <span className="font-mono text-sm text-cyan-300">
                {f.suffix === "$" ? money(f.value) : new Intl.NumberFormat("en-US").format(f.value)}
              </span>
            </div>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={f.value}
              onChange={(e) => f.set(Number(e.target.value))}
              className="mt-3 w-full accent-cyan-500"
              aria-label={f.label}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-indigo-950/20 p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            Estimated annual savings
          </p>
          <p className="mt-3 font-display text-5xl font-bold text-white">{money(result.total)}</p>
        </div>
        <dl className="mt-8 space-y-3 text-sm">
          <div className="flex items-center justify-between border-t border-resync-border/60 pt-3">
            <dt className="text-zinc-400">Manual time reclaimed</dt>
            <dd className="text-white">{Math.round(result.manualHoursPerYear).toLocaleString()} hrs</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-zinc-400">Manual run savings</dt>
            <dd className="text-white">{money(result.manualSavings)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-zinc-400">Self-heal incident savings</dt>
            <dd className="text-white">{money(result.incidentSavings)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-zinc-500">
          Estimates only. Assumes self-heal auto-resolves ~70% of incidents, saving ~45 min of
          engineering time each.
        </p>
      </div>
    </div>
  );
}
