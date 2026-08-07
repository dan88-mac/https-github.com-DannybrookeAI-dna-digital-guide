export type IntegrationCategory =
  | "Communication"
  | "Productivity"
  | "CRM & Sales"
  | "Commerce"
  | "AI & ML"
  | "Data & Storage"
  | "DevOps";

export interface Integration {
  name: string;
  category: IntegrationCategory;
  blurb: string;
  status: "available" | "beta" | "planned";
}

export const INTEGRATIONS: Integration[] = [
  { name: "Slack", category: "Communication", blurb: "Send messages, files, and alerts to channels.", status: "available" },
  { name: "Microsoft Teams", category: "Communication", blurb: "Post adaptive cards and notifications.", status: "available" },
  { name: "Discord", category: "Communication", blurb: "Notify servers via webhooks and bots.", status: "available" },
  { name: "Gmail", category: "Communication", blurb: "Send transactional and digest email.", status: "available" },
  { name: "Notion", category: "Productivity", blurb: "Create and sync database pages.", status: "available" },
  { name: "Google Sheets", category: "Productivity", blurb: "Append rows and read ranges.", status: "available" },
  { name: "Airtable", category: "Productivity", blurb: "Upsert records into bases.", status: "available" },
  { name: "Trello", category: "Productivity", blurb: "Create cards and move lists.", status: "beta" },
  { name: "HubSpot", category: "CRM & Sales", blurb: "Sync contacts, deals, and activities.", status: "available" },
  { name: "Salesforce", category: "CRM & Sales", blurb: "Create leads and update opportunities.", status: "beta" },
  { name: "Pipedrive", category: "CRM & Sales", blurb: "Push deals and persons.", status: "planned" },
  { name: "Shopify", category: "Commerce", blurb: "React to orders and update inventory.", status: "available" },
  { name: "Stripe", category: "Commerce", blurb: "Handle checkout, portal, and webhooks.", status: "available" },
  { name: "WooCommerce", category: "Commerce", blurb: "Sync products and orders.", status: "planned" },
  { name: "OpenAI", category: "AI & ML", blurb: "GPT chat, completion, and tool calling.", status: "available" },
  { name: "Anthropic", category: "AI & ML", blurb: "Claude chat and reasoning.", status: "available" },
  { name: "Google Vision", category: "AI & ML", blurb: "Labels, faces, and landmark detection.", status: "available" },
  { name: "ElevenLabs", category: "AI & ML", blurb: "Natural-sounding text-to-speech.", status: "available" },
  { name: "Whisper", category: "AI & ML", blurb: "Speech-to-text transcription.", status: "available" },
  { name: "Postgres", category: "Data & Storage", blurb: "Query and persist with RLS scoping.", status: "available" },
  { name: "Supabase", category: "Data & Storage", blurb: "Auth, database, and realtime.", status: "available" },
  { name: "S3", category: "Data & Storage", blurb: "Store and retrieve objects.", status: "beta" },
  { name: "Snowflake", category: "Data & Storage", blurb: "Warehouse queries and loads.", status: "planned" },
  { name: "GitHub", category: "DevOps", blurb: "Trigger on events; open issues and PRs.", status: "available" },
  { name: "PagerDuty", category: "DevOps", blurb: "Create and resolve incidents.", status: "available" },
  { name: "Datadog", category: "DevOps", blurb: "Emit metrics and events.", status: "beta" },
  { name: "Kubernetes", category: "DevOps", blurb: "Deploy and apply scale policies.", status: "beta" },
  { name: "Vercel", category: "DevOps", blurb: "Trigger deploys and read status.", status: "available" },
  { name: "Linear", category: "Productivity", blurb: "Create and update issues.", status: "available" },
  { name: "Zendesk", category: "CRM & Sales", blurb: "Open and update support tickets.", status: "planned" },
];

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  "Communication",
  "Productivity",
  "CRM & Sales",
  "Commerce",
  "AI & ML",
  "Data & Storage",
  "DevOps",
];
