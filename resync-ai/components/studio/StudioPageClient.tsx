"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FeePreview } from "@/components/community/FeePreview";
import { CodeSidePanel } from "@/components/builder/CodeSidePanel";
import { DemoPreviewPanel } from "@/components/studio/DemoPreviewPanel";
import { GraphPreview } from "@/components/studio/GraphPreview";
import { RefinementPanel } from "@/components/studio/RefinementPanel";
import { ContextInfo } from "@/components/ui/ContextInfo";
import { useModeration } from "@/hooks/useModeration";
import { useCommunityStore } from "@/hooks/useCommunityStore";
import { getModule, MODULE_CATALOG } from "@/lib/engine/moduleCatalog";
import {
  translateIdeaToGraph,
  type GraphScale,
  type IdeaGraphResult,
} from "@/lib/engine/ideaToCanvas";
import { calculateModelRefinement } from "@/lib/engine/refinementCalculator";
import {
  STUDIO_METHODS,
  type MethodFamily,
  type StudioMethod,
} from "@/lib/studio/methodTemplates";
import { createStudioDesign, saveStudioDesign } from "@/lib/studio/store";

const SCALE_OPTIONS: { id: GraphScale; label: string; desc: string }[] = [
  { id: "small", label: "Small", desc: "~3 nodes — quick prototypes" },
  { id: "large", label: "Large", desc: "8–15 nodes — production flows" },
  { id: "monster", label: "Monster", desc: "25–50 nodes — enterprise pipelines" },
];

const FAMILY_FILTERS: { id: MethodFamily | "all"; label: string }[] = [
  { id: "all", label: "All 50" },
  { id: "agentic", label: "Agentic" },
  { id: "saas", label: "SaaS" },
  { id: "ops", label: "Ops" },
  { id: "multimodal", label: "Multimodal" },
];

function scaleForMethod(m: StudioMethod): GraphScale {
  if (m.moduleMax <= 5) return "small";
  if (m.moduleMax <= 20) return "large";
  return "monster";
}

export function StudioPageClient() {
  const [idea, setIdea] = useState("");
  const [scaleOverride, setScaleOverride] = useState<GraphScale | null>(null);
  const [graphResult, setGraphResult] = useState<IdeaGraphResult | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [family, setFamily] = useState<MethodFamily | "all">("all");
  const [selectedMethod, setSelectedMethod] = useState<StudioMethod | null>(null);
  const [methodEnabled, setMethodEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(STUDIO_METHODS.map((m) => [m.id, m.onByDefault])),
  );
  const { createPost } = useCommunityStore();
  const { moderate } = useModeration();

  const filteredMethods = useMemo(
    () =>
      family === "all" ? STUDIO_METHODS : STUDIO_METHODS.filter((m) => m.family === family),
    [family],
  );

  const codeModules = useMemo(() => {
    if (!graphResult) return [];
    return graphResult.nodes
      .map((n) => {
        const mod = getModule(n.type) ?? MODULE_CATALOG.find((m) => m.id === n.type);
        if (mod) return mod;
        const label =
          typeof n.data?.label === "string" ? n.data.label : n.type;
        return {
          id: n.type,
          label,
          category: "agent" as const,
          libraries: [] as string[],
          purpose: selectedMethod?.purpose ?? "Studio node",
        };
      })
      .slice(0, 50);
  }, [graphResult, selectedMethod]);

  const refinement = useMemo(() => {
    if (!graphResult) return null;
    return calculateModelRefinement({
      nodes: graphResult.nodes,
      edges: graphResult.edges,
    });
  }, [graphResult]);

  const priceCents = useMemo(() => {
    const val = parseFloat(priceInput);
    if (!val || val <= 0) return undefined;
    return Math.round(val * 100);
  }, [priceInput]);

  const applyMethod = useCallback((m: StudioMethod) => {
    setSelectedMethod(m);
    setScaleOverride(scaleForMethod(m));
    setIdea((prev) =>
      prev.trim()
        ? prev
        : `${m.name}: ${m.explain} Next objective: ${m.nextObjective ?? "overview grade"}.`,
    );
  }, []);

  const generate = useCallback(() => {
    const scale =
      scaleOverride ?? (selectedMethod ? scaleForMethod(selectedMethod) : undefined);
    const result = translateIdeaToGraph(idea, scale ? { scale } : undefined);
    setGraphResult(result);
    setSavedId(null);
    setShareStatus(null);
  }, [idea, scaleOverride, selectedMethod]);

  const handleSave = useCallback(() => {
    if (!graphResult) return;
    const design = createStudioDesign({
      id: savedId ?? undefined,
      idea,
      scale: graphResult.scale,
      graph: { nodes: graphResult.nodes, edges: graphResult.edges },
      summary: graphResult.summary,
      priceCents,
    });
    saveStudioDesign(design);
    setSavedId(design.id);
    setShareStatus("Design saved locally");
  }, [graphResult, idea, priceCents, savedId]);

  const handleShare = useCallback(async () => {
    if (!graphResult) return;
    const combined = `${idea}\n${graphResult.summary}`;
    const modResult = await moderate(combined);
    if (!modResult.allowed) {
      setShareStatus("Share blocked by moderation policy");
      return;
    }

    const post = createPost({
      type: priceCents ? "marketplace" : "design",
      title: idea.slice(0, 80) || "Studio design",
      description: graphResult.summary,
      graph: { nodes: graphResult.nodes, edges: graphResult.edges },
      priceCents,
      tags: [graphResult.scale, "studio"],
    });

    if (post) {
      setShareStatus("Shared to community feed");
    }
  }, [graphResult, idea, priceCents, moderate, createPost]);

  const builderHref = useMemo(() => {
    if (!graphResult) return "/builder";
    const params = new URLSearchParams();
    params.set("studio", "1");
    if (savedId) params.set("design", savedId);
    return `/builder?${params.toString()}`;
  }, [graphResult, savedId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="studio-panel animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Studio</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Design your product workflow</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Describe your automation idea, generate a self-healing graph, refine it, and share with
          the community or open in the full builder.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400/80">
            Agentic workflows
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-white">
            Evolving agent graphs
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Build 2–3 node sparks up to 50-module monster pipelines with autonomous next-objective
            links. Toggle on/off, idle timers, and click triggers below — then open Builder.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-zinc-500">
            <li>· ReAct / tool-call / RAG agent modules from the catalog</li>
            <li>· Forge agent suggests templates (admin-approved)</li>
            <li>· Overview score gates “production ready”</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-indigo-400/80">
            SaaS website flows
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-white">
            Product & growth graphs
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Checkout heal, onboarding, notify, and marketplace patterns for the Resync SaaS itself —
            same studio, different intent.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-resync-border/80 bg-resync-surface/20 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Method templates · {STUDIO_METHODS.length}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Selection criteria module creator — on/off, idle, click triggers, next-objective links.
            </p>
          </div>
          <ContextInfo title="More soon" tone="violet">
            Fifty shipping methods now; Forge will propose additions under admin approval.
          </ContextInfo>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {FAMILY_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFamily(f.id)}
              className={`rounded-full px-3 py-1 text-xs ${
                family === f.id
                  ? "bg-indigo-600 text-white"
                  : "border border-resync-border text-zinc-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
          {filteredMethods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => applyMethod(m)}
              className={`rounded-xl border p-3 text-left transition ${
                selectedMethod?.id === m.id
                  ? "border-cyan-500/50 bg-cyan-950/30"
                  : "border-resync-border/70 hover:border-indigo-500/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">{m.name}</p>
                <span className="text-[10px] uppercase text-zinc-500">{m.family}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500">{m.explain}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-zinc-400">
                <label
                  className="inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={methodEnabled[m.id] ?? m.onByDefault}
                    onChange={(e) =>
                      setMethodEnabled((prev) => ({ ...prev, [m.id]: e.target.checked }))
                    }
                  />
                  on
                </label>
                <span>idle {m.idleSeconds}s</span>
                {m.clickTrigger && <span className="text-cyan-400">click</span>}
                <span>
                  {m.moduleHint}–{m.moduleMax} mods
                </span>
              </div>
            </button>
          ))}
        </div>
        {selectedMethod && (
          <p className="mt-3 text-xs text-indigo-300/90">
            Selected <strong className="text-white">{selectedMethod.name}</strong> —{" "}
            {selectedMethod.purpose}
            {selectedMethod.nextObjective
              ? ` · next → ${selectedMethod.nextObjective}`
              : ""}
          </p>
        )}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Idea input */}
          <section className="studio-panel glass rounded-2xl p-6">
            <label htmlFor="studio-idea" className="font-semibold text-white">
              Your idea
            </label>
            <textarea
              id="studio-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. When a customer abandons checkout, retry payment with healed shipping fields and notify the team on Slack"
              rows={4}
              className="mt-3 w-full rounded-xl border border-resync-border bg-resync-bg/50 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={generate}
              className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-900/30 hover:bg-indigo-500"
            >
              Generate workflow
            </button>
          </section>

          {/* Scale selector */}
          <section className="studio-panel glass rounded-2xl p-6" style={{ animationDelay: "50ms" }}>
            <h3 className="font-semibold text-white">Scale</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {SCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScaleOverride(opt.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    (scaleOverride ?? graphResult?.scale) === opt.id
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-resync-border hover:border-indigo-500/30"
                  }`}
                >
                  <p className="text-sm font-medium text-white">{opt.label}</p>
                  <p className="mt-1 text-xs text-zinc-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Graph preview */}
          <section className="studio-panel glass rounded-2xl p-6" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Workflow preview</h3>
              {graphResult && (
                <span className="text-xs text-zinc-500">
                  {graphResult.nodes.length} nodes · {graphResult.scale} scale
                </span>
              )}
            </div>
            {graphResult?.summary && (
              <p className="mt-2 text-sm text-indigo-300/80">{graphResult.summary}</p>
            )}
            <div className="mt-4">
              <GraphPreview
                nodes={graphResult?.nodes ?? []}
                edges={graphResult?.edges ?? []}
                compact={!!graphResult && graphResult.nodes.length > 12}
              />
            </div>
          </section>

          <DemoPreviewPanel nodes={graphResult?.nodes ?? []} />

          <section className="studio-panel" style={{ animationDelay: "120ms" }}>
            <CodeSidePanel modules={codeModules} />
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <RefinementPanel refinement={refinement} />

          {/* Marketplace pricing */}
          <section className="studio-panel glass rounded-2xl p-6" style={{ animationDelay: "150ms" }}>
            <h3 className="font-semibold text-white">Marketplace price</h3>
            <p className="mt-1 text-xs text-zinc-500">Optional — list your design for sale</p>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="0.00 USD"
              className="mt-3 w-full rounded-xl border border-resync-border bg-resync-bg/50 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600"
            />
            {priceCents != null && priceCents > 0 && <FeePreview priceCents={priceCents} />}
          </section>

          {/* Actions */}
          <section className="studio-panel glass rounded-2xl p-6" style={{ animationDelay: "200ms" }}>
            <h3 className="font-semibold text-white">Save & share</h3>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!graphResult}
                className="rounded-xl border border-resync-border px-4 py-2.5 text-sm text-zinc-300 hover:border-indigo-500/40 disabled:opacity-40"
              >
                Save design locally
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={!graphResult}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
              >
                Share to community
              </button>
              <Link
                href={builderHref}
                className={`rounded-xl px-4 py-2.5 text-center text-sm font-medium ${
                  graphResult
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "pointer-events-none bg-zinc-800 text-zinc-600"
                }`}
              >
                Open full builder
              </Link>
            </div>
            {shareStatus && (
              <p className="mt-3 text-xs text-emerald-400">{shareStatus}</p>
            )}
            {savedId && (
              <p className="mt-1 text-xs text-zinc-500">Saved as {savedId}</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
