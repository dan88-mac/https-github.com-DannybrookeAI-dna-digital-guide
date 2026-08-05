"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAgent } from "@/components/agent/AgentProvider";
import { cn } from "@/lib/utils";

function renderMarkdownLite(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-resync-bg/60 px-1 py-0.5 font-mono text-[11px] text-indigo-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={i} className="text-zinc-500">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AsyncAgentPanel() {
  const { isOpen, close, messages, sendMessage, isLoading, pendingPrompt, clearPendingPrompt } =
    useAgent();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (pendingPrompt && isOpen) {
      setInput(pendingPrompt);
      clearPendingPrompt();
    }
  }, [pendingPrompt, isOpen, clearPendingPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(text);
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        aria-hidden={!isOpen}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-resync-border/80 bg-resync-surface/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="a-sync agent chat"
        aria-hidden={!isOpen}
      >
        <header className="flex items-center justify-between border-b border-resync-border/80 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">a-sync agent</h2>
            <p className="text-[11px] text-zinc-500">Module advisor · navigation · QC tips</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close agent panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="rounded-xl border border-resync-border/60 bg-resync-bg/40 p-4 text-sm text-zinc-400">
              <p className="mb-2 text-white">Ask me anything about Resync AI.</p>
              <ul className="space-y-1 text-xs">
                <li>• &quot;Recommend a module for OCR&quot;</li>
                <li>• &quot;Summarize pricing&quot;</li>
                <li>• &quot;Add a starter module for webhooks&quot;</li>
                <li>• &quot;Take me to community&quot;</li>
              </ul>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user"
                  ? "ml-auto bg-indigo-600/90 text-white"
                  : "border border-resync-border/50 bg-resync-bg/50 text-zinc-300",
              )}
            >
              {msg.role === "assistant" ? renderMarkdownLite(msg.content) : msg.content}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
              </span>
              Thinking…
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-resync-border/80 p-4">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit(e);
                }
              }}
              placeholder="Ask a-sync agent…"
              rows={2}
              className="flex-1 resize-none rounded-lg border border-resync-border/80 bg-resync-bg/60 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="self-end rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
