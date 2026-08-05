"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { AgentAction } from "@/lib/agent/asyncAgent";

const MEMORY_KEY = "resync-agent-memory";
const SESSION_KEY = "resync-agent-session";

export interface AgentChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AgentContextValue {
  isOpen: boolean;
  open: (prompt?: string) => void;
  close: () => void;
  toggle: () => void;
  messages: AgentChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  pendingPrompt: string | null;
  clearPendingPrompt: () => void;
  sessionId: string;
  page: string;
  dispatchActions: (actions: AgentAction[]) => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

function pageFromPathname(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment || "home";
}

function ensureSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");

  const page = useMemo(() => pageFromPathname(pathname), [pathname]);

  useEffect(() => {
    setSessionId(ensureSessionId());
  }, []);

  const dispatchActions = useCallback((actions: AgentAction[]) => {
    for (const action of actions) {
      if (action.type === "navigate") {
        window.location.href = action.path;
      } else if (action.type === "add_module") {
        window.dispatchEvent(
          new CustomEvent("resync:add-module", { detail: { moduleId: action.moduleId } }),
        );
      }
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: AgentChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            page,
            sessionId,
            history: messages.slice(-10),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Request failed");
        }

        const data = await res.json();
        const assistantMsg: AgentChatMessage = {
          role: "assistant",
          content: data.reply ?? "No response.",
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.memoryBlob) {
          localStorage.setItem(MEMORY_KEY, data.memoryBlob);
        }

        if (data.actions?.length) {
          dispatchActions(data.actions);
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              err instanceof Error
                ? `Sorry — ${err.message}`
                : "Sorry, I couldn't reach the agent right now.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, page, sessionId, messages, dispatchActions],
  );

  const open = useCallback((prompt?: string) => {
    setIsOpen(true);
    if (prompt) setPendingPrompt(prompt);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((o) => !o), []);
  const clearPendingPrompt = useCallback(() => setPendingPrompt(null), []);

  const value = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      messages,
      sendMessage,
      isLoading,
      pendingPrompt,
      clearPendingPrompt,
      sessionId,
      page,
      dispatchActions,
    }),
    [
      isOpen,
      open,
      close,
      toggle,
      messages,
      sendMessage,
      isLoading,
      pendingPrompt,
      clearPendingPrompt,
      sessionId,
      page,
      dispatchActions,
    ],
  );

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgent(): AgentContextValue {
  const ctx = useContext(AgentContext);
  if (!ctx) {
    throw new Error("useAgent must be used within AgentProvider");
  }
  return ctx;
}
