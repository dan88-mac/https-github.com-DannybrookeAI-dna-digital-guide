export type ChangeTag = "feature" | "improvement" | "fix" | "security";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  summary: string;
  changes: { tag: ChangeTag; text: string }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.4.0",
    date: "2026-08-05",
    title: "Command palette, ROI calculator, and 18 new content surfaces",
    summary:
      "A large content release: a global ⌘K search, an interactive ROI calculator, and deep reference pages for nodes, integrations, and the API.",
    changes: [
      { tag: "feature", text: "Global command palette (⌘K) searches every page and feature." },
      { tag: "feature", text: "Interactive ROI calculator estimates automation + self-heal savings." },
      { tag: "feature", text: "Node reference documents every module's inputs, outputs, and params." },
      { tag: "feature", text: "Integrations directory with 30+ connectors and category filters." },
      { tag: "improvement", text: "Dismissible 'what's new' banner tied to the latest release." },
    ],
  },
  {
    version: "2.3.1",
    date: "2026-07-22",
    title: "Self-heal circuit breaker tuning",
    summary:
      "Reduced false-open circuit breakers on bursty endpoints and improved backoff jitter.",
    changes: [
      { tag: "fix", text: "Circuit breaker no longer opens on a single 429 from rate-limited APIs." },
      { tag: "improvement", text: "Exponential backoff now uses full jitter to spread retries." },
      { tag: "security", text: "Fallback endpoints are validated against the private-IP blocklist in prod." },
    ],
  },
  {
    version: "2.3.0",
    date: "2026-07-08",
    title: "Refinement score v2 and marketplace payouts",
    summary:
      "A rebuilt refinement scoring model and creator payouts for the marketplace.",
    changes: [
      { tag: "feature", text: "Refinement score v2 weighs logic quality, completeness, and efficiency." },
      { tag: "feature", text: "Marketplace creator payouts with transparent fee breakdown." },
      { tag: "improvement", text: "Builder autosave debounced to 2s with optimistic UI." },
    ],
  },
  {
    version: "2.2.0",
    date: "2026-06-19",
    title: "Multimodal function library",
    summary: "Vision, speech, and text functions unified in a searchable library.",
    changes: [
      { tag: "feature", text: "Added Whisper STT, ElevenLabs TTS, and Google Vision functions." },
      { tag: "feature", text: "Library grid/list view with category and provider filters." },
      { tag: "fix", text: "OCR node now handles multi-page PDFs without truncation." },
    ],
  },
  {
    version: "2.1.0",
    date: "2026-05-30",
    title: "Overview integrity score",
    summary: "A seven-pillar integrity score for every workspace.",
    changes: [
      { tag: "feature", text: "Overview score dashboard with pillar breakdown and trend." },
      { tag: "improvement", text: "Telemetry aggregates now update in near real-time." },
    ],
  },
];

export const LATEST_RELEASE = CHANGELOG[0];
