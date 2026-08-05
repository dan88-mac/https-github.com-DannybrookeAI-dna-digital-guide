"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "Mission" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
];

export function Header() {
  const pathname = usePathname();

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
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm text-zinc-300 hover:text-white sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/builder"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
          >
            Open builder
          </Link>
        </div>
      </div>
    </header>
  );
}
