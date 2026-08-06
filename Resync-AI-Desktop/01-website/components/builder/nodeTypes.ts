import { MODULE_CATALOG } from "@/lib/engine/moduleCatalog";
import { NodeCard } from "@/components/builder/NodeCard";

const catalogTypes = Object.fromEntries(MODULE_CATALOG.map((mod) => [mod.id, NodeCard]));

/** Legacy aliases kept for older templates and exports. */
const LEGACY_ALIASES: Record<string, typeof NodeCard> = {
  resync: NodeCard,
  step: NodeCard,
  default: NodeCard,
};

export const builderNodeTypes = {
  ...catalogTypes,
  ...LEGACY_ALIASES,
};
