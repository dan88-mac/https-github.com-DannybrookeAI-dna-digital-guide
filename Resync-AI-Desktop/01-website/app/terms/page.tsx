import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/marketing/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Resync AI",
  description: "Terms governing use of the Resync AI platform and marketplace.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="August 5, 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Resync AI,
        including the builder, studio, community marketplace, APIs, and related services
        (collectively, the &quot;Service&quot;). By using the Service, you agree to these Terms and
        our{" "}
        <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
          Privacy Policy
        </Link>
        ,{" "}
        <Link href="/acceptable-use" className="text-indigo-400 hover:text-indigo-300">
          Acceptable Use Policy
        </Link>
        , and{" "}
        <Link href="/trademark" className="text-indigo-400 hover:text-indigo-300">
          Trademark Guidelines
        </Link>
        .
      </p>

      <LegalSection title="Eligibility and accounts">
        <p>
          You must be at least 16 years old and able to form a binding contract to use the Service.
          You are responsible for safeguarding your credentials and for all activity under your
          account. Organization owners are responsible for members they invite and for billing
          associated with their workspace.
        </p>
      </LegalSection>

      <LegalSection title="Subscriptions and credits">
        <p>
          Paid plans renew monthly unless canceled. Credits reset each billing cycle and do not
          roll over unless stated otherwise on your plan. Downgrades take effect at the next
          renewal. Refunds are handled according to our billing policy and applicable consumer
          protection laws.
        </p>
      </LegalSection>

      <LegalSection title="Community marketplace and fees">
        <p>
          The Resync AI marketplace allows creators to publish templates, modules, and workflows,
          and allows buyers to license or purchase those assets. Standard marketplace transactions
          are subject to a <strong className="text-zinc-200">10% buyer fee</strong> and a{" "}
          <strong className="text-zinc-200">10% seller fee</strong> (20% total platform take) on
          the gross transaction amount, unless a different rate is agreed in writing (for example,
          Enterprise customers may qualify for a reduced 12% total fee).
        </p>
        <p>
          Sellers must have rights to distribute listed content. Resync AI may hold payouts pending
          fraud review or policy violations. Chargebacks and payment disputes may result in fee
          reversals and account restrictions.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>
          You agree to comply with our{" "}
          <Link href="/acceptable-use" className="text-indigo-400 hover:text-indigo-300">
            Acceptable Use Policy
          </Link>
          . We may suspend or terminate accounts that violate these Terms or pose risk to the
          platform or other users.
        </p>
      </LegalSection>

      <LegalSection title="Your content and license to Resync AI">
        <p>
          You retain ownership of workflows, templates, and other content you create
          (&quot;Your Content&quot;). You grant Resync AI a worldwide, non-exclusive license to
          host, display, execute, and distribute Your Content as needed to operate the Service,
          including running self-heal operations and delivering marketplace listings you publish.
        </p>
        <p>
          For free community templates, you grant other users a license to use, modify, and fork
          those templates within the Service according to the license you specify at publish time.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Resync AI and its licensors own the Service, including software, visual design, documentation,
          and the Resync AI name and logos. Except for rights expressly granted, no license is
          implied. Feedback you provide may be used to improve the Service without obligation to
          you.
        </p>
      </LegalSection>

      <LegalSection title="Trademarks">
        <p>
          &quot;Resync AI&quot; and associated brand assets are trademarks of Resync AI. Use of our
          marks is governed by our{" "}
          <Link href="/trademark" className="text-indigo-400 hover:text-indigo-300">
            Trademark Guidelines
          </Link>
          . You may not use our trademarks in a way that suggests endorsement or affiliation
          without written permission.
        </p>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          The Service integrates with third-party APIs, models, and payment processors. Your use of
          those services is subject to their terms. Resync AI is not responsible for third-party
          outages, pricing changes, or data practices.
        </p>
      </LegalSection>

      <LegalSection title="Self-healing and automation disclaimer">
        <p>
          Self-heal features propose automated fixes based on runtime signals and AI analysis.
          You are responsible for reviewing changes before deployment to production. Resync AI
          does not guarantee that healed workflows will be error-free or suitable for regulated
          environments without human review.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE
          OPERATION.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, RESYNC AI AND ITS SUPPLIERS WILL NOT BE LIABLE
          FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
          PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS
          OR THE SERVICE IS LIMITED TO THE GREATER OF (A) AMOUNTS YOU PAID TO RESYNC AI IN THE
          TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS ($100).
        </p>
      </LegalSection>

      <LegalSection title="Indemnification">
        <p>
          You will indemnify and hold harmless Resync AI from claims arising from Your Content,
          your use of the Service, violation of these Terms, or infringement of third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You may stop using the Service at any time. We may suspend or terminate access for
          violations, non-payment, or risk to the platform. Upon termination, your right to use the
          Service ends; provisions that by nature should survive (including IP, liability limits,
          and dispute resolution) will survive.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of the State of Delaware, USA, without regard to
          conflict-of-law principles, except where mandatory consumer protections in your
          jurisdiction apply.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Legal notices:{" "}
          <a href="mailto:legal@resync.ai" className="text-indigo-400 hover:text-indigo-300">
            legal@resync.ai
          </a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
