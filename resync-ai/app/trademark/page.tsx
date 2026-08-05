import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/marketing/LegalLayout";

export const metadata: Metadata = {
  title: "Trademark Guidelines — Resync AI",
  description: "Guidelines for using Resync AI trademarks and brand assets.",
};

export default function TrademarkPage() {
  return (
    <LegalLayout title="Trademark Guidelines" updated="August 5, 2026">
      <p>
        These guidelines explain how you may reference Resync AI trademarks and brand assets. They
        apply to community members, marketplace sellers, press, and integration partners. For
        permissions not covered here, contact{" "}
        <a href="mailto:brand@resync.ai" className="text-indigo-400 hover:text-indigo-300">
          brand@resync.ai
        </a>
        .
      </p>

      <LegalSection title="Our trademarks">
        <p>
          Resync AI owns the &quot;Resync AI&quot; word mark, the Resync logomark, and related
          trade dress including the indigo node motif and product UI styling. These marks identify
          the source of Resync AI products and services.
        </p>
      </LegalSection>

      <LegalSection title="Permitted uses">
        <p>You may use Resync AI marks without prior written approval when you:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Truthfully state that your workflow, template, or integration was &quot;built with
            Resync AI&quot; or &quot;runs on Resync AI&quot;
          </li>
          <li>
            Describe compatibility (&quot;Resync AI export,&quot; &quot;Resync AI marketplace
            template&quot;) in factual, non-misleading language
          </li>
          <li>
            Link to official Resync AI pages (resync.ai) using plain text—not altered logos
          </li>
          <li>
            Use screenshots of the Resync AI interface in documentation or tutorials that accurately
            depict the product, without implying endorsement
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Uses that require permission">
        <p>Contact brand@resync.ai before you:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Display Resync AI logos on your website, app store listing, or merchandise</li>
          <li>
            Use &quot;Resync AI&quot; or confusingly similar marks in your product or company name
          </li>
          <li>Claim partnership, sponsorship, or certification by Resync AI</li>
          <li>Modify, animate, or combine our marks with other brands</li>
          <li>Use our marks in paid advertising or co-branded campaigns</li>
        </ul>
      </LegalSection>

      <LegalSection title="Prohibited uses">
        <ul className="list-disc space-y-2 pl-5">
          <li>Using Resync AI marks as the primary branding for your own product or service</li>
          <li>Registering domain names, social handles, or trademarks containing &quot;Resync&quot;</li>
          <li>Implying Resync AI endorses content that violates our Acceptable Use Policy</li>
          <li>Distorting, recoloring, or placing marks on busy backgrounds that reduce legibility</li>
        </ul>
      </LegalSection>

      <LegalSection title="Marketplace sellers">
        <p>
          Templates and modules listed on the Resync AI marketplace may reference the platform in
          titles and descriptions (e.g., &quot;Resync AI CRM sync pack&quot;). Do not use official
          logos as listing thumbnails unless you have written approval. Your listing must not
          suggest it is an official Resync AI product unless it is published by Resync AI.
        </p>
      </LegalSection>

      <LegalSection title="Attribution examples">
        <div className="rounded-xl border border-resync-border bg-resync-surface/50 p-4 font-mono text-xs text-zinc-400">
          <p className="text-emerald-400">✓ &quot;Built with Resync AI&quot;</p>
          <p className="mt-2 text-emerald-400">✓ &quot;Compatible with Resync AI workflows&quot;</p>
          <p className="mt-2 text-red-400">✗ &quot;Resync CRM — official Resync AI app&quot;</p>
          <p className="mt-2 text-red-400">✗ Resync AI logo as your app icon</p>
        </div>
      </LegalSection>

      <LegalSection title="Enforcement">
        <p>
          Unauthorized or confusing use of our marks may result in takedown requests, marketplace
          listing removal, or legal action. We aim to resolve good-faith misunderstandings quickly—
          reach out before launching public campaigns that feature our brand.
        </p>
      </LegalSection>

      <LegalSection title="Related policies">
        <p>
          See also our{" "}
          <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/acceptable-use" className="text-indigo-400 hover:text-indigo-300">
            Acceptable Use Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
