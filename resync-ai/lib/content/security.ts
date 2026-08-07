export interface SecurityPractice {
  title: string;
  description: string;
  icon: string;
}

export interface Subprocessor {
  name: string;
  purpose: string;
  location: string;
}

export const SECURITY_PRACTICES: SecurityPractice[] = [
  {
    title: "Tenant isolation with RLS",
    description:
      "Every tenant row is scoped by organization with Postgres row-level security. Cross-org access is denied by policy, not by convention.",
    icon: "shield",
  },
  {
    title: "Encrypted secrets",
    description:
      "Service keys and customer webhook secrets are encrypted at rest and never exposed to client bundles.",
    icon: "lock",
  },
  {
    title: "Signed & idempotent webhooks",
    description:
      "Inbound Stripe webhooks are signature-verified; a processed-event table prevents replay and duplicate side effects.",
    icon: "signature",
  },
  {
    title: "Egress allowlisting",
    description:
      "In production the self-heal runtime blocks private-IP ranges and only calls allow-listed fallback endpoints.",
    icon: "network",
  },
  {
    title: "Rate limiting & circuit breakers",
    description:
      "Execution routes are rate-limited per org, and circuit breakers stop runaway failures from burning credits.",
    icon: "gauge",
  },
  {
    title: "Audit logging",
    description:
      "Sensitive actions are written to an append-only audit log with actor, resource, and metadata for every event.",
    icon: "list",
  },
];

export const SECURITY_CERTS = [
  { label: "SOC 2 Type II", state: "In progress" },
  { label: "GDPR", state: "Compliant" },
  { label: "CCPA", state: "Compliant" },
  { label: "Data encryption", state: "At rest & in transit" },
];

export const SUBPROCESSORS: Subprocessor[] = [
  { name: "Supabase", purpose: "Managed Postgres, auth, storage", location: "US / EU" },
  { name: "Stripe", purpose: "Billing and payment processing", location: "US" },
  { name: "OpenAI", purpose: "LLM inference for self-heal", location: "US" },
  { name: "Vercel", purpose: "Application hosting and edge", location: "Global" },
  { name: "Upstash", purpose: "Rate limiting (Redis)", location: "US / EU" },
];
