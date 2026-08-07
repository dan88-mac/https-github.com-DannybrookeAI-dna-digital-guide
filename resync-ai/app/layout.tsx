import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { WebGLCanvas } from "@/components/ui/WebGLCanvas";
import { SiteAgentShell } from "@/components/agent/SiteAgentShell";
import { CommandPalette } from "@/components/content/CommandPalette";
import { AnnouncementBanner } from "@/components/content/AnnouncementBanner";
import { LATEST_RELEASE } from "@/lib/content/changelog";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resync AI — Multimodal workflows that heal in production",
  description:
    "Build self-healing automation on a living canvas. Export real Next.js code, scale from starter flows to enterprise meshes, and ship with a studio built for teams who return.",
  manifest: "/manifest.json",
  themeColor: "#050508",
  openGraph: {
    title: "Resync AI — Workflows that heal in production",
    description:
      "Multimodal workflow canvas with self-healing nodes, code export, and enterprise-scale pipelines.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="font-sans">
        <SiteAgentShell>
          <WebGLCanvas />
          <Header />
          <CommandPalette />
          <main className="min-h-screen pt-16">
            <AnnouncementBanner
              id={LATEST_RELEASE.version}
              message={`v${LATEST_RELEASE.version} — ${LATEST_RELEASE.title}`}
              href="/changelog"
              cta="See what's new"
            />
            {children}
          </main>
          <Footer />
        </SiteAgentShell>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(){});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
