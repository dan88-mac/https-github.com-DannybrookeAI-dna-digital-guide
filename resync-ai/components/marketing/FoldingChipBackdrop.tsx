"use client";

import { Typewriter } from "@/components/marketing/Typewriter";

/** UE5-inspired chip / fold loop using CSS 3D (no Unreal binary). */
export function FoldingChipBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-24 h-56 w-[min(920px,92vw)] -translate-x-1/2 [perspective:1400px]">
        <div className="relative h-full w-full animate-[spin_40s_linear_infinite] [transform-style:preserve-3d]">
          <div className="absolute inset-0 rounded-[2rem] border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/20 shadow-[0_0_80px_rgba(34,211,238,0.12)] [transform:rotateX(62deg)_rotateZ(-8deg)]" />
          <div className="absolute inset-6 rounded-[1.5rem] border border-indigo-400/20 bg-resync-surface/40 backdrop-blur-sm [transform:translateZ(28px)_rotateX(62deg)_rotateZ(-8deg)]" />
          <div className="absolute left-[12%] top-[38%] h-3 w-24 rounded-full bg-cyan-400/50 blur-[1px] [transform:translateZ(40px)_rotateX(62deg)]" />
          <div className="absolute right-[18%] top-[42%] h-3 w-16 rounded-full bg-indigo-400/40 blur-[1px] [transform:translateZ(40px)_rotateX(62deg)]" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-resync-bg to-transparent" />
    </div>
  );
}

export function VisionQuoteBand() {
  return (
    <p className="mt-6 max-w-xl font-display text-lg text-zinc-200 md:text-xl">
      <Typewriter text="Build once. Heal always. Compound." />
    </p>
  );
}
