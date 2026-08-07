"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  q: string;
  a: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-resync-border/60 overflow-hidden rounded-2xl border border-resync-border/60 bg-resync-surface/40">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
            >
              <span className="text-sm font-medium text-white">{item.q}</span>
              <svg
                className={cn(
                  "h-4 w-4 shrink-0 text-zinc-400 transition-transform",
                  isOpen && "rotate-45 text-cyan-300"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
