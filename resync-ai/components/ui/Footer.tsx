import Link from "next/link";
import { NewsletterForm } from "@/components/content/NewsletterForm";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/builder", label: "Builder" },
      { href: "/studio", label: "Studio" },
      { href: "/multimodal", label: "Multimodal" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/integrations", label: "Integrations" },
      { href: "/overview-score", label: "Overview score" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/tools", label: "Toolbox" },
      { href: "/api-reference", label: "API reference" },
      { href: "/nodes", label: "Node reference" },
      { href: "/changelog", label: "Changelog" },
      { href: "/status", label: "Status" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/learn", label: "Learn" },
      { href: "/blog", label: "Blog" },
      { href: "/glossary", label: "Glossary" },
      { href: "/faq", label: "FAQ" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/customers", label: "Customers" },
      { href: "/compare", label: "Compare" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/roi", label: "ROI calculator" },
      { href: "/careers", label: "Careers" },
      { href: "/community", label: "Community" },
    ],
  },
  {
    heading: "Trust & legal",
    links: [
      { href: "/security", label: "Security" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/acceptable-use", label: "Acceptable Use" },
      { href: "/trademark", label: "Trademark" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-resync-border bg-resync-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_3fr]">
          <div>
            <p className="text-lg font-semibold text-white">Resync AI</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
              Multimodal workflows that heal themselves.
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Product updates
            </p>
            <div className="mt-3 max-w-sm">
              <NewsletterForm source="footer" compact />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {col.heading}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-resync-border py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Resync AI. Multimodal workflows that heal themselves.
      </div>
    </footer>
  );
}
