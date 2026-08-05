import { NodeBoard } from "@/components/builder/NodeBoard";

export default function BuilderPage({
  searchParams,
}: {
  searchParams: { template?: string };
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Workflow builder</h1>
        <p className="text-sm text-zinc-400">
          Design flows that self-heal in production—then export code your team can reuse forever.
        </p>
      </div>
      <NodeBoard templateSlug={searchParams.template} />
    </div>
  );
}
