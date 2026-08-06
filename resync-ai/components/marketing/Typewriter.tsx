"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  className?: string;
  speedMs?: number;
}

/** Letter-by-letter loop with reduced-motion fallback. */
export function Typewriter({ text, className, speedMs = 42 }: TypewriterProps) {
  const [out, setOut] = useState("");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    if (mq.matches) {
      setOut(text);
      return;
    }
    let i = 0;
    let dir: 1 | -1 = 1;
    const id = window.setInterval(() => {
      i += dir;
      if (i >= text.length + 8) dir = -1;
      if (i <= 0) dir = 1;
      setOut(text.slice(0, Math.max(0, Math.min(text.length, i))));
    }, speedMs);
    return () => window.clearInterval(id);
  }, [text, speedMs]);

  return (
    <span className={className} aria-label={text}>
      {reduce ? text : out}
      {!reduce && <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-cyan-300 align-[-0.1em]" />}
    </span>
  );
}
