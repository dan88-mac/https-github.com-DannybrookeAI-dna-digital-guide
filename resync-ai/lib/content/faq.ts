export interface FaqCategory {
  category: string;
  items: { q: string; a: string }[];
}

export const FAQ: FaqCategory[] = [
  {
    category: "Getting started",
    items: [
      {
        q: "What is Resync AI?",
        a: "Resync AI is a multimodal workflow platform. You design workflows on a visual canvas, run them against real endpoints, and when a step fails the self-healing runtime patches schemas or routes to fallbacks under policy limits.",
      },
      {
        q: "Do I need to write code to use it?",
        a: "No. You build workflows visually in the Builder and generate them from a prompt in the Studio. When you're ready to ship, you can export production Next.js code — but that's optional.",
      },
      {
        q: "Is there a free tier?",
        a: "Yes. The Community plan is free forever and includes the builder, marketplace browsing, and a monthly allotment of AI generations.",
      },
    ],
  },
  {
    category: "Self-healing",
    items: [
      {
        q: "How does self-healing actually work?",
        a: "When a node fails, the runtime calls an LLM with tightly-scoped tools: patch a missing field, execute an allow-listed fallback endpoint, or abort with a user-safe reason. It retries up to three times with exponential backoff and records every step to telemetry.",
      },
      {
        q: "Will self-heal call arbitrary URLs?",
        a: "No. In production, fallback endpoints are validated against an allowlist and private-IP ranges are blocked. Every attempt is logged for audit.",
      },
      {
        q: "What happens when a workflow can't be healed?",
        a: "The runtime aborts with a structured, user-safe message and a trace ID, and a circuit breaker opens for that org+endpoint to prevent cascading failures.",
      },
    ],
  },
  {
    category: "Billing & plans",
    items: [
      {
        q: "How are credits metered?",
        a: "Each self-heal and AI generation consumes credits tracked per organization. Your plan sets a monthly limit; you can view usage on the dashboard and upgrade anytime.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. Manage your subscription from the Stripe customer portal — upgrade, downgrade, or cancel with no lock-in.",
      },
      {
        q: "What are marketplace fees?",
        a: "Resync keeps a flat 10% from the buyer and 10% from the seller on marketplace transactions. There are no hidden fees.",
      },
    ],
  },
  {
    category: "Security & data",
    items: [
      {
        q: "Where is my data stored?",
        a: "Workflow data is stored in Postgres with row-level security scoped to your organization. Secrets are encrypted at rest and never exposed to the client.",
      },
      {
        q: "Do you train models on my workflows?",
        a: "No. Your workflow content and execution data are never used to train models.",
      },
    ],
  },
];
