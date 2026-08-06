import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/marketing/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Resync AI",
  description: "How Resync AI collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 5, 2026">
      <p>
        Resync AI (&quot;Resync,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates
        the Resync AI platform, including the workflow builder, studio, community marketplace, and
        related services. This Privacy Policy explains what information we collect, how we use it,
        and the choices you have.
      </p>

      <LegalSection title="Information we collect">
        <p>
          <strong className="text-zinc-200">Account data.</strong> When you create an account, we
          collect your email address, display name, organization membership, and authentication
          identifiers provided by our identity provider.
        </p>
        <p>
          <strong className="text-zinc-200">Workflow and canvas data.</strong> We store the nodes,
          edges, configuration, and metadata you create in the builder and studio, including
          exported code artifacts and template listings you publish.
        </p>
        <p>
          <strong className="text-zinc-200">Usage and telemetry.</strong> We collect execution
          logs, self-heal events, credit consumption, API call metadata, and performance metrics
          to operate and improve the platform.
        </p>
        <p>
          <strong className="text-zinc-200">Payment data.</strong> Billing is processed by Stripe.
          We receive subscription status, invoice references, and limited payment metadata—we do
          not store full card numbers on our servers.
        </p>
        <p>
          <strong className="text-zinc-200">Community interactions.</strong> Waitlist sign-ups,
          marketplace purchases, seller profiles, and support correspondence may be retained to
          operate the community marketplace.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and similar technologies">
        <p>
          We use essential cookies and local storage to keep you signed in, remember preferences,
          and enable offline draft sync in our progressive web app. Analytics cookies, when
          enabled, help us understand feature adoption and reliability. You can control
          non-essential cookies through your browser settings; disabling essential cookies may
          limit platform functionality.
        </p>
      </LegalSection>

      <LegalSection title="Credentials and third-party integrations">
        <p>
          When you connect external services (API keys, OAuth tokens, webhooks), credentials are
          encrypted at rest and scoped to your organization. We access third-party APIs only to
          execute workflows you configure. You are responsible for the permissions you grant and
          for rotating credentials when team members leave.
        </p>
      </LegalSection>

      <LegalSection title="AI processing">
        <p>
          Resync AI uses large language and multimodal models to power idea-to-canvas generation,
          self-healing suggestions, and runtime assistance. Prompts, workflow context, and
          execution outputs may be sent to model providers under data-processing agreements. We do
          not use your private workflow content to train public foundation models without your
          explicit opt-in.
        </p>
        <p>
          Self-heal operations may analyze error traces, node configurations, and recent execution
          history to propose fixes. You can review and accept or reject heal suggestions before
          they are applied.
        </p>
      </LegalSection>

      <LegalSection title="How we use your information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, secure, and improve the Resync AI platform</li>
          <li>Process subscriptions, marketplace transactions, and credit balances</li>
          <li>Send service announcements, security alerts, and billing notices</li>
          <li>Enforce our Terms of Service and Acceptable Use Policy</li>
          <li>Comply with legal obligations and respond to lawful requests</li>
        </ul>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          Account and workflow data are retained while your account is active. After closure, we
          delete or anonymize personal data within 90 days unless a longer period is required for
          legal, billing, or dispute resolution. Telemetry and aggregated analytics may be retained
          in de-identified form. Marketplace transaction records are kept as required for tax and
          compliance purposes.
        </p>
      </LegalSection>

      <LegalSection title="Sharing and subprocessors">
        <p>
          We share data with infrastructure providers (hosting, databases), payment processors,
          email delivery, and AI model providers strictly to deliver the service. We do not sell
          your personal information. A current list of subprocessors is available on request.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on your location, you may have the right to access, correct, delete, or export
          your personal data; object to or restrict certain processing; and withdraw consent where
          processing is consent-based. To exercise these rights, contact us at{" "}
          <a href="mailto:privacy@resync.ai" className="text-indigo-400 hover:text-indigo-300">
            privacy@resync.ai
          </a>
          . We will respond within the timeframe required by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We implement encryption in transit and at rest, role-based access controls, and regular
          security reviews. No method of transmission over the Internet is 100% secure; please use
          strong passwords and enable available organization security features.
        </p>
      </LegalSection>

      <LegalSection title="International transfers">
        <p>
          Resync AI may process data in the United States and other countries where our providers
          operate. We use appropriate safeguards for cross-border transfers as required by
          applicable regulations.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          The platform is not directed to children under 16. We do not knowingly collect personal
          information from children. Contact us if you believe a child has provided data and we
          will delete it promptly.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be posted on
          this page with an updated date. Continued use of Resync AI after changes constitutes
          acceptance of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For privacy inquiries, data subject requests, or subprocessors questions, email{" "}
          <a href="mailto:privacy@resync.ai" className="text-indigo-400 hover:text-indigo-300">
            privacy@resync.ai
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
