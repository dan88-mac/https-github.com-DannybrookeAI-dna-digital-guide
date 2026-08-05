"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FeePreview } from "@/components/community/FeePreview";
import { DemoPreviewPanel } from "@/components/studio/DemoPreviewPanel";
import { GraphPreview } from "@/components/studio/GraphPreview";
import { RefinementPanel } from "@/components/studio/RefinementPanel";
import { useModeration } from "@/hooks/useModeration";
import { useCommunityStore } from "@/hooks/useCommunityStore";
import {
  translateIdeaToGraph,
  type GraphScale,
  type IdeaGraphResult,
} from "@/lib/engine/ideaToCanvas";
import { calculateModelRefinement } from "@/lib/engine/refinementCalculator";
import { createStudioDesign, saveStudioDesign } from "@/lib/studio/store";

const SCALE_OPTIONS: { id: GraphScale; label: string; desc: string }[] = [
  { id: "small", label: "Small", desc: "~3 nodes — quick prototypes" },
  { id: "large", label: "Large", desc: "8–15 nodes — production flows" },
  { id: "monster", label: "Monster", desc: "25–50 nodes — enterprise pipelines" },
];

export function StudioPageClient() {
  const [idea, setIdea] = useState("");
  const [scaleOverride, setScaleOverride] = useState<GraphScale | null>(null);
  const [graphResult, setGraphResult] = useState<IdeaGraphResult | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const { createPost } = useCommunityStore();
  const { moderate } = useModeration();

  const refinement = useMemo(() => {
    if (!graphResult) return null;
    return calculateModelRefinement(graphResult);
  }, [graphResult]);

  const priceCents = useMemo(() => {
    const val = parseFloat(priceInput);
    if (!val || val <= 0) return undefined;
    return Math.round(val * 100);
  }, [priceInput]);

  const generate = useCallback(() => {
    const result = translateIdeaToGraph(idea);
    if (scaleOverride && scaleOverride !== result.scale) {
      const scaledIdea =
        scaleOverride === "monster"
          ? `${idea} and integrate multiple systems with conditional branching and parallel processing`
          : scaleOverride === "large"
            ? `${idea} with validation and notification steps`
            : idea.split(" ").slice(0, 8).join(" ");
      const scaled = translateIdeaToGraph(scaledIdea);
      setGraphResult({ ...scaled, scale: scaleOverride });
    } else {
      setGraphResult(result);
    }
    setSavedId(null);
    setShareStatus(null);
  }, [idea, scaleOverride]);

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
