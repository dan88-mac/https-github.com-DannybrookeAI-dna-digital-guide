import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Server-safe presentational primitives shared across the content features.
 * Keeps individual content pages thin and visually consistent with the
 * Resync design system (resync-* tokens, display/mono fonts, glass panels).
 */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/70">{children}</p>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-resync-border/60">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">{lede}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>}
    </div>
  );
}

export function Panel({
  children,
  className,
  hover,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-resync-border/60 bg-resync-surface/40 p-6",
        hover && "transition hover:border-cyan-500/40 hover:bg-resync-surface/70",
        className
      )}
    >
      {children}
    </div>
  );
}

const PILL_TONES = {
  neutral: "border-resync-border bg-white/5 text-zinc-300",
  cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
} as const;

export type PillTone = keyof typeof PILL_TONES;

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        PILL_TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-resync-border/60 bg-resync-surface/40 p-5">
      <p className="font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </div>
  );
}

export function CtaRow({
  primary,
  secondary,
}: {
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={primary.href}
        className="rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/20 transition hover:brightness-110"
      >
        {primary.label}
      </Link>
      {secondary && (
        <Link
          href={secondary.href}
          className="rounded-xl border border-resync-border px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
