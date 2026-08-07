import type { Metadata } from "next";
import { PageHero, Pill } from "@/components/content/ContentKit";
import { ToolboxClient } from "@/components/tools/ToolboxClient";
import { TOOL_COUNT, TOOL_CATEGORIES } from "@/lib/tools/logic";

export const metadata: Metadata = {
  title: "Toolbox — Resync AI",
  description:
    "100+ free, in-browser developer tools: encoders, converters, formatters, hashers, and generators. Everything runs client-side.",
};

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Toolbox"
        title={`${TOOL_COUNT} tools that run in your browser`}
        lede="Encoders, converters, formatters, hashers, and generators — every result is computed locally, nothing leaves your device. Pick a tool and start typing."
      >
        <div className="flex flex-wrap gap-2">
          {TOOL_CATEGORIES.map((c) => (
            <Pill key={c}>{c}</Pill>
          ))}
        </div>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <ToolboxClient />
      </div>
    </>
  );
}
