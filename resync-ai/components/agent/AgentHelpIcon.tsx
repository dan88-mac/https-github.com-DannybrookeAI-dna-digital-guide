"use client";

import { useAgent } from "@/components/agent/AgentProvider";
import { cn } from "@/lib/utils";

const PAGE_PROMPTS: Record<string, string> = {
  builder: "What module should I add next for my workflow?",
  community: "How does the community marketplace work?",
  pricing: "Summarize Resync AI pricing tiers",
  studio: "How do I publish a design from Studio?",
  dashboard: "What metrics can I see on the dashboard?",
  templates: "How do I use a community template?",
  vision: "Explain multimodal vision modules",
  multimodal: "Help me pick one multimodal module for image OCR",
  marketplace: "Which official workflows are free vs paid?",
  "overview-score": "Explain the overview integrity score pillars",
  home: "What can the a-sync agent help me with?",
};

interface AgentHelpIconProps {
  className?: string;
  prompt?: string;
  size?: "sm" | "md";
}

export function AgentHelpIcon({ className, prompt, size = "sm" }: AgentHelpIconProps) {
  const { open, page } = useAgent();
  const contextualPrompt = prompt ?? PAGE_PROMPTS[page] ?? PAGE_PROMPTS.home;

  const dim = size === "sm" ? "h-6 w-6 text-[11px]" : "h-8 w-8 text-xs";

  return (
    <button
      type="button"
      onClick={() => open(contextualPrompt)}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-resync-border/80 bg-resync-surface/80 text-zinc-400 transition hover:border-indigo-500/60 hover:bg-indigo-600/20 hover:text-indigo-300",
        dim,
        className,
      )}
      title="Ask a-sync agent"
      aria-label="Ask a-sync agent"
    >
      ?
    </button>
  );
}
