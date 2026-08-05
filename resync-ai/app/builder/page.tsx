import { NodeBoard } from "@/components/builder/NodeBoard";

export default function BuilderPage({
  searchParams,
}: {
  searchParams: { template?: string; design?: string; studio?: string };
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Multimodal workflow studio</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-400">
          Describe an idea in plain language—vision, voice, text, commerce, or DevOps—and
          Resync generates a production-ready graph from 50 catalog modules. Refine density,
          inspect nodes, score resilience, and simulate execution before export.
        </p>
      </div>
      <NodeBoard templateSlug={searchParams.template} designId={searchParams.design} />
    </div>
  );
}
