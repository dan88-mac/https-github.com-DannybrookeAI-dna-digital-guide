import { NodeBoard } from "@/components/builder/NodeBoard";
import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";

export default function BuilderPage({
  searchParams,
}: {
  searchParams: { template?: string; design?: string; studio?: string; addModule?: string };
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <BuilderPageHeader />
      <NodeBoard
        templateSlug={searchParams.template}
        designId={searchParams.design}
        addModule={searchParams.addModule}
      />
    </div>
  );
}
