export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  role: string;
  date: string;
  readingMinutes: number;
  tags: string[];
  /** Simple paragraph/heading blocks — rendered without a markdown dep. */
  body: { type: "p" | "h2" | "quote"; text: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "designing-workflows-that-heal",
    title: "Designing workflows that heal in production",
    excerpt:
      "Retries aren't resilience. Here's how we approach self-healing as a first-class design constraint instead of a bolt-on.",
    author: "Daniel Brooke",
    role: "Founder",
    date: "2026-08-01",
    readingMinutes: 6,
    tags: ["self-heal", "architecture"],
    body: [
      { type: "p", text: "Most automation breaks the first time an upstream API changes a field. The traditional answer is a retry loop, but retrying a malformed request just fails faster." },
      { type: "h2", text: "Treat failure as an input" },
      { type: "p", text: "Resync treats a failed step as structured input to a bounded decision: patch the payload, route to a fallback, or abort with a safe message. The LLM only ever sees tightly-scoped tools." },
      { type: "quote", text: "Resilience is a design constraint, not an afterthought." },
      { type: "p", text: "Because every attempt is logged to telemetry with a trace ID, you can see exactly what the runtime tried — and why it stopped." },
    ],
  },
  {
    slug: "refinement-score-v2",
    title: "How refinement score v2 ranks workflows",
    excerpt:
      "A transparent look at the four signals behind a workflow's quality score and why efficiency matters as much as completeness.",
    author: "Kina A.",
    role: "Product Engineer",
    date: "2026-07-18",
    readingMinutes: 5,
    tags: ["marketplace", "scoring"],
    body: [
      { type: "p", text: "Refinement score v2 blends four signals: logic quality, completeness, efficiency, and best practices." },
      { type: "h2", text: "Why efficiency counts" },
      { type: "p", text: "A workflow that reaches the same result with fewer redundant calls costs less to run and heals faster. We reward that explicitly." },
      { type: "p", text: "Scores are recomputed on every save so the marketplace always reflects the current graph." },
    ],
  },
  {
    slug: "multimodal-intake-pipeline",
    title: "Building a multimodal document intake pipeline",
    excerpt:
      "OCR to summary to structured storage in five nodes — a walkthrough of a real workflow you can clone from the marketplace.",
    author: "Mike R.",
    role: "Solutions",
    date: "2026-06-28",
    readingMinutes: 7,
    tags: ["multimodal", "tutorial"],
    body: [
      { type: "p", text: "Document intake is the canonical multimodal use case: an image or PDF comes in, and structured data needs to come out." },
      { type: "h2", text: "The five-node shape" },
      { type: "p", text: "Upload trigger → OCR extract → summarize → validate → persist. Each edge carries typed output to the next node." },
      { type: "p", text: "Add a self-heal node on the OCR edge and the pipeline recovers from low-confidence extractions automatically." },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
