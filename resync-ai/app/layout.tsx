import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { WebGLCanvas } from "@/components/ui/WebGLCanvas";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resync AI — Self-healing workflows for teams who return",
  description:
    "Build, heal, and export production workflows. Join a purpose-driven community of builders.",
  manifest: "/manifest.json",
  themeColor: "#050508",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebGLCanvas />
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
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
