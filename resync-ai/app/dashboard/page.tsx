import Link from "next/link";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { TelemetryTable } from "@/components/dashboard/TelemetryTable";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-zinc-400">
            Your workflows, heal rate, and credits—everything you need for the next ship.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/builder"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Open builder
          </Link>
          <Link
            href="/templates"
            className="rounded-xl border border-resync-border px-4 py-2 text-sm text-white"
          >
            New from template
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <MetricsGrid />
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent telemetry</h2>
        <TelemetryTable />
      </div>
    </div>
  );
}
