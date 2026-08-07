import type { Metadata } from "next";
import { PageHero } from "@/components/content/ContentKit";
import { RoiCalculator } from "@/components/content/RoiCalculator";

export const metadata: Metadata = {
  title: "ROI calculator — Resync AI",
  description: "Estimate the annual savings from automating workflow runs and self-healing incidents.",
};

export default function RoiPage() {
  return (
    <>
      <PageHero
        eyebrow="ROI calculator"
        title="What could Resync save you?"
        lede="Drag the sliders to model your team's automation and incident load. The estimate updates instantly."
      />

      <div className="mx-auto max-w-5xl px-4 py-16">
        <RoiCalculator />
      </div>
    </>
  );
}
