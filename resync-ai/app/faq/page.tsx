import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/content/ContentKit";
import { Accordion } from "@/components/content/Accordion";
import { FAQ } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "FAQ — Resync AI",
  description: "Answers to common questions about Resync AI: self-healing, billing, security, and more.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        lede="Can't find what you're looking for? Search with ⌘K or reach out in the community."
      />

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-16">
        {FAQ.map((cat) => (
          <section key={cat.category}>
            <SectionHeading title={cat.category} className="mb-6" />
            <Accordion items={cat.items} />
          </section>
        ))}
      </div>
    </>
  );
}
