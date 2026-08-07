/**
 * Central registry of content destinations. Powers the global command palette
 * (⌘K search) and the /resources hub. Plain data — safe to import from both
 * server and client components.
 */

export type ContentGroup =
  | "Product"
  | "Learn"
  | "Company"
  | "Developers"
  | "Trust";

export interface ContentEntry {
  title: string;
  href: string;
  group: ContentGroup;
  description: string;
  keywords: string[];
  /** True for the 20 features shipped in this content build. */
  feature?: boolean;
}

export const CONTENT_REGISTRY: ContentEntry[] = [
  // ── Product ──
  {
    title: "Studio",
    href: "/studio",
    group: "Product",
    description: "Describe an idea and generate a workflow with a live preview.",
    keywords: ["generate", "idea", "workflow", "ai"],
  },
  {
    title: "Builder",
    href: "/builder",
    group: "Product",
    description: "Visual multimodal workflow canvas with self-healing nodes.",
    keywords: ["canvas", "nodes", "react flow", "editor"],
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    group: "Product",
    description: "Tested, ready-to-run workflows — free, subscription, and paid.",
    keywords: ["buy", "sell", "workflows", "templates"],
  },
  {
    title: "Multimodal library",
    href: "/multimodal",
    group: "Product",
    description: "48 vision, text, speech, and integration functions.",
    keywords: ["functions", "vision", "ocr", "whisper", "llm"],
  },
  {
    title: "Overview score",
    href: "/overview-score",
    group: "Product",
    description: "System integrity score across seven engineering pillars.",
    keywords: ["integrity", "score", "pillars", "health"],
  },
  {
    title: "Integrations",
    href: "/integrations",
    group: "Product",
    description: "Connect Slack, Notion, HubSpot, Shopify, and 30+ tools.",
    keywords: ["connect", "slack", "notion", "hubspot", "api"],
    feature: true,
  },
  {
    title: "Node reference",
    href: "/nodes",
    group: "Product",
    description: "Every node type documented with inputs, outputs, and params.",
    keywords: ["nodes", "reference", "modules", "params"],
    feature: true,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    group: "Product",
    description: "What we're building now, next, and later — with vote counts.",
    keywords: ["roadmap", "planned", "upcoming", "vote"],
    feature: true,
  },

  // ── Learn ──
  {
    title: "Docs",
    href: "/docs",
    group: "Learn",
    description: "Guides and references organized by topic.",
    keywords: ["documentation", "guides", "help"],
    feature: true,
  },
  {
    title: "Learn",
    href: "/learn",
    group: "Learn",
    description: "Structured learning paths from first flow to production.",
    keywords: ["tutorial", "course", "paths", "lessons"],
    feature: true,
  },
  {
    title: "Blog",
    href: "/blog",
    group: "Learn",
    description: "Engineering deep-dives, product updates, and field notes.",
    keywords: ["articles", "insights", "posts", "news"],
    feature: true,
  },
  {
    title: "Glossary",
    href: "/glossary",
    group: "Learn",
    description: "Definitions for self-healing, refinement score, and more.",
    keywords: ["terms", "definitions", "vocabulary"],
    feature: true,
  },
  {
    title: "FAQ",
    href: "/faq",
    group: "Learn",
    description: "Answers to common questions about Resync AI.",
    keywords: ["questions", "answers", "help", "support"],
    feature: true,
  },
  {
    title: "Events & webinars",
    href: "/events",
    group: "Learn",
    description: "Live sessions and on-demand recordings.",
    keywords: ["webinar", "workshop", "live", "recording"],
    feature: true,
  },

  // ── Developers ──
  {
    title: "API reference",
    href: "/api-reference",
    group: "Developers",
    description: "REST endpoints for runtime, workflows, and telemetry.",
    keywords: ["api", "rest", "endpoints", "sdk", "developers"],
    feature: true,
  },
  {
    title: "Changelog",
    href: "/changelog",
    group: "Developers",
    description: "Every release, tagged by feature, fix, and improvement.",
    keywords: ["releases", "updates", "versions", "notes"],
    feature: true,
  },
  {
    title: "System status",
    href: "/status",
    group: "Developers",
    description: "Live component uptime and incident history.",
    keywords: ["uptime", "incidents", "status", "outage"],
    feature: true,
  },

  // ── Company ──
  {
    title: "Customers",
    href: "/customers",
    group: "Company",
    description: "Case studies and results from teams shipping with Resync.",
    keywords: ["case study", "customers", "stories", "results"],
    feature: true,
  },
  {
    title: "Compare",
    href: "/compare",
    group: "Company",
    description: "How Resync AI compares to alternatives, feature by feature.",
    keywords: ["comparison", "vs", "alternatives", "matrix"],
    feature: true,
  },
  {
    title: "Careers",
    href: "/careers",
    group: "Company",
    description: "Open roles and how we work.",
    keywords: ["jobs", "hiring", "roles", "team"],
    feature: true,
  },
  {
    title: "ROI calculator",
    href: "/roi",
    group: "Company",
    description: "Estimate the yearly savings from automation and self-heal.",
    keywords: ["roi", "savings", "calculator", "value"],
    feature: true,
  },

  // ── Trust ──
  {
    title: "Security & trust",
    href: "/security",
    group: "Trust",
    description: "Our security practices, compliance, and subprocessors.",
    keywords: ["security", "compliance", "soc2", "trust", "privacy"],
    feature: true,
  },
];

export const FEATURE_ENTRIES = CONTENT_REGISTRY.filter((e) => e.feature);

export function groupedRegistry(): Record<ContentGroup, ContentEntry[]> {
  return CONTENT_REGISTRY.reduce(
    (acc, entry) => {
      (acc[entry.group] ||= []).push(entry);
      return acc;
    },
    {} as Record<ContentGroup, ContentEntry[]>
  );
}
