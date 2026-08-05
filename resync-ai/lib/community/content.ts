import type { WorkflowTemplate } from "@/types/database";

export const COMMUNITY_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "tpl-ecommerce-recovery",
    name: "E‑commerce checkout recovery",
    slug: "checkout-recovery",
    category: "Commerce",
    description: "Heal missing shipping fields and retry payment webhooks automatically.",
    uses: 12400,
    graph: {
      nodes: [
        { id: "1", type: "httpRequest", position: { x: 0, y: 0 }, data: { label: "Checkout API" } },
        { id: "2", type: "selfHeal", position: { x: 280, y: 0 }, data: { label: "Schema patch" } },
        { id: "3", type: "webhookOut", position: { x: 560, y: 0 }, data: { label: "Notify team" } },
      ],
      edges: [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
      ],
    },
  },
  {
    id: "tpl-saas-onboarding",
    name: "SaaS user onboarding",
    slug: "saas-onboarding",
    category: "Growth",
    description: "Validate signup payloads, fallback CRM sync, and welcome email dispatch.",
    uses: 8900,
    graph: {
      nodes: [
        { id: "1", type: "httpRequest", position: { x: 0, y: 80 }, data: { label: "Auth signup" } },
        { id: "2", type: "condition", position: { x: 260, y: 80 }, data: { label: "Email valid?" } },
        { id: "3", type: "selfHeal", position: { x: 520, y: 80 }, data: { label: "Patch profile" } },
      ],
      edges: [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
      ],
    },
  },
  {
    id: "tpl-devops-incident",
    name: "Incident auto-remediation",
    slug: "incident-remediation",
    category: "DevOps",
    description: "Detect alert webhooks, run fallback health checks, post to Slack.",
    uses: 15200,
    graph: {
      nodes: [
        { id: "1", type: "webhookOut", position: { x: 0, y: 160 }, data: { label: "Pager alert" } },
        { id: "2", type: "httpRequest", position: { x: 280, y: 160 }, data: { label: "Health probe" } },
        { id: "3", type: "selfHeal", position: { x: 560, y: 160 }, data: { label: "Restart policy" } },
      ],
      edges: [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
      ],
    },
  },
  {
    id: "tpl-nonprofit-intake",
    name: "Purpose-driven intake forms",
    slug: "nonprofit-intake",
    category: "Community",
    description: "Normalize volunteer applications and sync to your database with self-healing.",
    uses: 4300,
    graph: {
      nodes: [
        { id: "1", type: "httpRequest", position: { x: 0, y: 240 }, data: { label: "Form submit" } },
        { id: "2", type: "transform", position: { x: 260, y: 240 }, data: { label: "Normalize" } },
        { id: "3", type: "selfHeal", position: { x: 520, y: 240 }, data: { label: "Fix required fields" } },
      ],
      edges: [
        { id: "e1", source: "1", target: "2" },
        { id: "e2", source: "2", target: "3" },
      ],
    },
  },
];

export const MISSION_PILLARS = [
  {
    title: "Reliability for everyone",
    body: "Automations should recover gracefully—not wake you at 3 a.m. Resync gives builders and operators the same self-healing superpowers.",
  },
  {
    title: "Community templates",
    body: "Share and remix workflows. Every template you publish helps someone ship faster—and earns visibility in our community gallery.",
  },
  {
    title: "Return value",
    body: "Your workflow library, credits, and exports stay with you. Come back for the next launch, migration, or incident—your canvas is waiting.",
  },
];
