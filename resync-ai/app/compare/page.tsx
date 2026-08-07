import type { Metadata } from "next";
import { PageHero, CtaRow } from "@/components/content/ContentKit";
import { COMPARE_COLUMNS, COMPARE_ROWS, COMPARE_SUMMARY } from "@/lib/content/compare";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Compare — Resync AI",
  description: "How Resync AI compares to generic iPaaS tools and code-only stacks, feature by feature.",
};

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) {
    return (
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full",
          highlight ? "bg-cyan-500/20 text-cyan-300" : "bg-emerald-500/10 text-emerald-300"
        )}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return <span className="text-zinc-600">—</span>;
  }
  return <span className="text-xs text-zinc-400">{value}</span>;
}

export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Resync AI vs. the alternatives"
        lede={COMPARE_SUMMARY}
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="overflow-x-auto rounded-2xl border border-resync-border/60">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-resync-border/60">
                <th className="px-5 py-4 text-xs uppercase tracking-wider text-zinc-500">Feature</th>
                {COMPARE_COLUMNS.map((col) => (
                  <th
                    key={col.name}
                    className={cn(
                      "px-5 py-4 text-center font-display text-sm font-bold",
                      col.highlight ? "text-cyan-300" : "text-zinc-300"
                    )}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-resync-border/60">
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature} className="bg-resync-surface/20">
                  <td className="px-5 py-3.5 text-zinc-300">{row.feature}</td>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-5 py-3.5 text-center",
                        COMPARE_COLUMNS[i]?.highlight && "bg-cyan-500/[0.04]"
                      )}
                    >
                      <Cell value={v} highlight={COMPARE_COLUMNS[i]?.highlight} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex justify-center">
          <CtaRow primary={{ href: "/studio", label: "Try Resync AI" }} secondary={{ href: "/pricing", label: "Compare plans" }} />
        </div>
      </div>
    </>
  );
}
