import { MultimodalCatalogClient } from "@/components/multimodal/MultimodalCatalogClient";

export const metadata = {
  title: "Multimodal Library — Resync AI",
  description:
    "Browse Resync AI's multimodal function catalog — vision, voice, text, commerce, DevOps, and integration modules with pairing hints.",
};

export default function MultimodalPage() {
  return <MultimodalCatalogClient />;
}
