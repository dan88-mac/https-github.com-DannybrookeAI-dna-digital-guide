"use client";

import { AgentProvider } from "@/components/agent/AgentProvider";
import { AsyncAgentPanel } from "@/components/agent/AsyncAgentPanel";
import { useAgent } from "@/components/agent/AgentProvider";

function FloatingAgentButton() {
  const { toggle, isOpen } = useAgent();

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex h-12 items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-600 px-4 text-sm font-medium text-white shadow-lg shadow-indigo-900/50 transition hover:bg-indigo-500 hover:shadow-indigo-800/60"
      aria-label={isOpen ? "Close a-sync agent" : "Open a-sync agent"}
      aria-expanded={isOpen}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
        ⚡
      </span>
      <span className="hidden sm:inline">Ask a-sync agent</span>
    </button>
  );
}

export function SiteAgentShell({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      {children}
      <AsyncAgentPanel />
      <FloatingAgentButton />
    </AgentProvider>
  );
}
