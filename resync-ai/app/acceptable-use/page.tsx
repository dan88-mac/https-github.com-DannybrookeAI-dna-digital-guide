import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/marketing/LegalLayout";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — Resync AI",
  description: "Community standards and prohibited conduct on Resync AI.",
};

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use Policy" updated="August 5, 2026">
      <p>
        Resync AI is built for builders who create reliable, inclusive automation. This Acceptable
        Use Policy (&quot;AUP&quot;) applies to all users of the platform, including the builder,
        studio, APIs, community spaces, and marketplace. Violations may result in content removal,
        account suspension, or permanent termination.
      </p>

      <LegalSection title="Our commitment">
        <p>
          We expect every participant to treat others with respect. Harassment, hate, and abuse have
          no place on Resync AI—in workflows, marketplace listings, comments, support channels, or
          any other surface of the Service.
        </p>
      </LegalSection>

      <LegalSection title="Prohibited conduct">
        <p>You may not use Resync AI to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Promote, incite, or engage in racism, ethnic hatred, xenophobia, or discrimination based
            on race, color, national origin, religion, gender, gender identity, sexual orientation,
            disability, age, or any protected characteristic
          </li>
          <li>
            Harass, bully, threaten, stalk, or intimidate any person or group, including targeted
            abuse toward community members, sellers, or Resync AI staff
          </li>
          <li>
            Publish or distribute content that is sexually exploitative, graphically violent, or
            otherwise intended to shock or harm
          </li>
          <li>
            Facilitate illegal activity, including fraud, malware distribution, unauthorized access
            to systems, or circumvention of export controls and sanctions
          </li>
          <li>
            Scrape, spam, or automate interactions in ways that degrade the Service for others
          </li>
          <li>
            Misrepresent identity, impersonate others, or create deceptive marketplace listings
          </li>
          <li>
            Upload or execute workflows designed to mine cryptocurrency, launch denial-of-service
            attacks, or abuse third-party APIs without authorization
          </li>
          <li>
            Violate intellectual property rights, including selling templates you do not have
            rights to distribute
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Content standards">
        <p>
          Marketplace templates, community posts, and public workflow metadata must be accurately
          described, appropriately licensed, and free of slurs, dehumanizing language, and
          discriminatory framing. AI-generated content you publish remains your responsibility—you
          must review it before making it public.
        </p>
      </LegalSection>

      <LegalSection title="Security and abuse">
        <p>
          Do not probe, scan, or test the vulnerability of Resync AI systems without written
          permission. Report security issues responsibly to{" "}
          <a href="mailto:security@resync.ai" className="text-indigo-400 hover:text-indigo-300">
            security@resync.ai
          </a>
          . Attempts to bypass rate limits, credit systems, or access controls are prohibited.
        </p>
      </LegalSection>

      <LegalSection title="Enforcement">
        <p>
          We investigate reports of AUP violations using a combination of automated signals and
          human review. Depending on severity and history, enforcement actions may include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Warning and required remediation</li>
          <li>Removal or unpublishing of offending content</li>
          <li>Temporary suspension of marketplace or publishing privileges</li>
          <li>Account suspension or permanent ban</li>
          <li>Withholding or reversing marketplace payouts tied to fraudulent activity</li>
          <li>Referral to law enforcement where required</li>
        </ul>
        <p>
          We may act proactively when content or behavior poses imminent harm, even without a
          formal report.
        </p>
      </LegalSection>

      <LegalSection title="Reporting">
        <p>
          If you encounter content or behavior that violates this policy, report it via{" "}
          <a href="mailto:trust@resync.ai" className="text-indigo-400 hover:text-indigo-300">
            trust@resync.ai
          </a>{" "}
          or through in-product reporting when available. Include links, screenshots, and context
          to help us investigate quickly.
        </p>
      </LegalSection>

      <LegalSection title="Appeals">
        <p>
          If you believe enforcement action was taken in error, reply to the notice you received
          or contact{" "}
          <a href="mailto:trust@resync.ai" className="text-indigo-400 hover:text-indigo-300">
            trust@resync.ai
          </a>{" "}
          within 14 days with your account email and a description of why the action should be
          reversed.
        </p>
      </LegalSection>

      <LegalSection title="Relationship to other policies">
        <p>
          This AUP supplements our{" "}
          <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
            Privacy Policy
          </Link>
          . In case of conflict, the Terms govern.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
