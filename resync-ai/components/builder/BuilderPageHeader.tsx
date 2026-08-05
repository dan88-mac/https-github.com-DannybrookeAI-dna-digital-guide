"use client";

import { MODULE_CATALOG } from "@/lib/engine/moduleCatalog";
import { AgentHelpIcon } from "@/components/agent/AgentHelpIcon";

export function BuilderPageHeader() {
  return (
    <div className="mb-4">
      <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-white">
        Multimodal workflow studio
        <AgentHelpIcon
          size="md"
          prompt="Recommend one starter module for my use case — ask what I'm building"
        />
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-400">
        Browse {MODULE_CATALOG.length} catalog modules across vision, voice, text, libraries, and
        integrations. Use <span className="text-indigo-300">Browse all</span> for the full modal,
        ask the a-sync agent for a single recommended node, or generate a graph from a plain-language
        idea. Overview integrity scoring is available for Pro &amp; Enterprise.
      </p>
    </div>
  );
}
