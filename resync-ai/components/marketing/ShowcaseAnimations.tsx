import { cn } from "@/lib/utils";

/** Named animation utility classes — keyframes live in globals.css + tailwind.config.ts */
export const showcaseAnimations = {
  pan: "animate-pan",
  transitionLap: "animate-transition-lap",
  dropDown: "animate-drop-down",
  fadeRise: "animate-fade-rise",
  revealWipe: "animate-reveal-wipe",
  glowPulse: "animate-glow-pulse",
  circuitFlow: "animate-circuit-flow",
  parallaxDrift: "animate-parallax-drift",
} as const;

export type ShowcaseAnimation = keyof typeof showcaseAnimations;

type AnimatedProps = {
  animation: ShowcaseAnimation;
  className?: string;
  children: React.ReactNode;
  delay?: string;
};

export function AnimatedSection({ animation, className, children, delay }: AnimatedProps) {
  return (
    <div
      className={cn(showcaseAnimations[animation], className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {children}
    </div>
  );
}
