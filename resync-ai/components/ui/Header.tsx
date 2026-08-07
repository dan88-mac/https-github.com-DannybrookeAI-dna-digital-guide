"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/studio", label: "Studio" },
  { href: "/builder", label: "Builder" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/multimodal", label: "Multimodal" },
  { href: "/community", label: "Community" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

function openCommandPalette() {
  window.dispatchEvent(new Event("resync:open-command"));
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-resync-border/60 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">
            R
          </span>
          Resync AI
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition hover:text-white",
                pathname === l.href && "text-indigo-300"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Search (Command or Control + K)"
            className="hidden items-center gap-2 rounded-lg border border-resync-border px-3 py-2 text-sm text-zinc-400 transition hover:text-white sm:inline-flex"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <kbd className="font-mono text-[10px] text-zinc-500">⌘K</kbd>
          </button>
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm text-zinc-300 hover:text-white sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/builder"
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 sm:inline-flex"
          >
            Open builder
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-resync-border text-zinc-300 transition hover:bg-white/5 hover:text-white md:hidden"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-resync-border/60 glass md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm transition hover:bg-white/5",
                  pathname === l.href ? "bg-white/5 text-indigo-300" : "text-zinc-300"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-resync-border pt-4">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2.5 text-center text-sm text-zinc-300 hover:bg-white/5"
              >
                Sign in
              </Link>
              <Link
                href="/builder"
                className="rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-500"
              >
                Open builder
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
