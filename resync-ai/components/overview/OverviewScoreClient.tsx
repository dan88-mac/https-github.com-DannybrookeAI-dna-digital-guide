"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Edge, Node } from "@xyflow/react";
import { computeOverviewScore } from "@/lib/engine/overviewScore";
import {
  canAccessOverviewScore,
  readSubscriberTier,
  SUBSCRIBER_TIER_KEY,
} from "@/lib/billing/access";
import { TierGate } from "@/components/billing/TierGate";
import type { SubscriptionTier } from "@/types/database";

const DRAFT_KEY = "resync-workflow-draft";

const PILLAR_LABELS: Record<string, string> = {
  structuralIntegrity: "Structural integrity",
  multimodalCoverage: "Multimodal coverage",
  resilience: "Self-heal / resilience",
  libraryGrounding: "Library grounding",
  scheduleOpsMaturity: "Schedule & ops maturity",
  realWorldReadiness: "Real-world readiness",
  pairingCompliance: "Pairing compliance",
};

function loadGraphFromDraft(): { nodes: Node[]; edges: Edge[] } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as { nodes?: Node[]; edges?: Edge[] };
    if (!draft.nodes?.length) return null;
    return { nodes: draft.nodes, edges: draft.edges ?? [] };
  } catch {
    return null;
  }
}

function PillarBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-zinc-300">{Math.round(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-resync-border/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RadarChart({ pillars }: { pillars: Record<string, number> }) {
  const entries = Object.entries(pillars);
  const cx = 120;
  const cy = 120;
  const r = 90;
  const angleStep = (2 * Math.PI) / entries.length;

  const points = entries.map(([, val], i) => {
    const angle = i * angleStep - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  });

  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="mx-auto h-48 w-48">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <circle
          key={scale}
          cx={cx}
          cy={cy}
          r={r * scale}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          className="text-zinc-500"
        />
      ))}
      {entries.map(([, val], i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeOpacity={0.2}
            className="text-zinc-500"
          />
        );
      })}
      <polygon
        points={polygon}
        fill="rgba(99,102,241,0.25)"
        stroke="rgb(99,102,241)"
        strokeWidth={2}
      />
    </svg>
  );
}

export function OverviewScoreClient() {
  const [tier, setTier] = useState<SubscriptionTier>("FREE");
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);

  useEffect(() => {
    setTier(readSubscriberTier());
    setGraph(loadGraphFromDraft());

    const onStorage = (e: StorageEvent) => {
      if (e.key === SUBSCRIBER_TIER_KEY) setTier(readSubscriberTier());
      if (e.key === DRAFT_KEY) setGraph(loadGraphFromDraft());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const result = useMemo(() => {
    if (!graph) return null;
    return computeOverviewScore({
      nodes: graph.nodes.map((n) => ({
        id: n.id,
        type: (n.data as { nodeType?: string }).nodeType ?? n.type ?? "httpRequest",
        data: n.data as Record<string, unknown>,
      })),
      edges: graph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
      })),
    });
  }, [graph]);

  const hasAccess = canAccessOverviewScore(tier);
  const gradeColor =
    result && result.grade.startsWith("A")
      ? "text-emerald-400"
      : result && result.grade.startsWith("B")
        ? "text-indigo-300"
        : result && result.grade.startsWith("C")
          ? "text-amber-400"
          : "text-red-400";

  if (!graph) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-lg text-white">No workflow draft found</p>
        <p className="mt-2 text-sm text-zinc-400">
          Build a graph in the builder and save a draft, then return here for your integrity score.
        </p>
        <Link
          href="/builder"
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Open builder
        </Link>
      </div>
    );
  }

  const teaserContent = result && (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-zinc-500">Overview integrity</p>
          <p className="text-6xl font-bold text-white">{result.overall}</p>
        </div>
        <span className={`text-5xl font-bold ${gradeColor}`}>{result.grade}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RadarChart pillars={result.pillars} />
        <div className="space-y-3">
          {Object.entries(result.pillars).map(([key, val]) => (
            <PillarBar key={key} label={PILLAR_LABELS[key] ?? key} value={val} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-indigo-400">a-sync approved analysis</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Overview integrity score</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Scientific-style integrity index combining structural graph validation, multimodal
            coverage, resilience ratios, library grounding, and operational maturity.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/builder"
            className="rounded-lg border border-resync-border px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            ← Builder
          </Link>
          {result && (
            <span
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                result.eligible
                  ? "bg-emerald-950/50 text-emerald-300"
                  : "bg-amber-950/50 text-amber-300"
              }`}
            >
              {result.eligible ? "Marketplace eligible" : "Not yet eligible"}
            </span>
          )}
        </div>
      </div>

      {!hasAccess ? (
        <TierGate tier={tier} feature="overview_score" teaser={teaserContent}>
          {teaserContent}
        </TierGate>
      ) : (
        result && (
          <>
            <div className="glass rounded-2xl p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wider text-zinc-500">Overall score</p>
                  <p className="text-7xl font-bold text-white">{result.overall}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Grade</p>
                  <p className={`text-6xl font-bold ${gradeColor}`}>{result.grade}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Pillar radar
                </h2>
                <RadarChart pillars={result.pillars} />
              </div>
              <div className="glass rounded-2xl p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Pillar breakdown
                </h2>
                <div className="space-y-4">
                  {Object.entries(result.pillars).map(([key, val]) => (
                    <PillarBar key={key} label={PILLAR_LABELS[key] ?? key} value={val} />
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white">{result.blueprint.title}</h2>
              <div className="mt-6 space-y-6">
                {result.blueprint.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="text-sm font-semibold text-indigo-300">{section.heading}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{section.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Findings
                </h2>
                {result.findings.length === 0 ? (
                  <p className="mt-4 text-sm text-emerald-400">No critical findings — graph looks solid.</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {result.findings.map((f) => (
                      <li
                        key={f}
                        className="rounded-lg border border-resync-border/50 bg-resync-bg/40 px-3 py-2 text-sm text-zinc-400"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="glass rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Engineer notes
                </h2>
                <ul className="mt-4 space-y-2">
                  {result.blueprint.engineerNotes.map((note) => (
                    <li
                      key={note}
                      className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 px-3 py-2 text-sm text-indigo-200/80"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
