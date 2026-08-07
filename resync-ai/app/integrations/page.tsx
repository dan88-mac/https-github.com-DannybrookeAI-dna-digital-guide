import type { Metadata } from "next";
import { PageHero } from "@/components/content/ContentKit";
import { IntegrationsExplorer } from "@/components/content/IntegrationsExplorer";

export const metadata: Metadata = {
  title: "Integrations — Resync AI",
  description: "Connect Slack, Notion, HubSpot, Shopify, OpenAI, and 30+ tools to your workflows.",
};

export default function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Integrations"
        title="Connect the tools you already use"
        lede="Wire any of these into a workflow node. Filter by category or search to find what you need."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <IntegrationsExplorer />
      </div>
    </>
  );
}
