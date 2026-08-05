import { z } from "zod";
import { isValidModuleId, MODULE_IDS } from "@/lib/engine/moduleCatalog";

/** Primary workflow node types used by the builder UI and runtime. */
export const CORE_WORKFLOW_NODE_TYPES = [
  "httpRequest",
  "transform",
  "condition",
  "selfHeal",
  "webhookOut",
  "vision",
  "voice",
  "text",
  "trigger",
  "humanApprove",
  "delay",
  "integrate",
] as const;

export type CoreWorkflowNodeType = (typeof CORE_WORKFLOW_NODE_TYPES)[number];

export type WorkflowNodeType = CoreWorkflowNodeType | string;

export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.string().min(1).refine(isValidModuleId, {
    message: `Node type must be a catalog module id (e.g. ${CORE_WORKFLOW_NODE_TYPES.join(", ")}, …)`,
  }),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.unknown()),
});

export const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

export const workflowGraphSchema = z.object({
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
});

export const saveWorkflowSchema = z.object({
  organizationId: z.string().uuid(),
  workflowId: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  graph: workflowGraphSchema,
});

export type WorkflowGraph = z.infer<typeof workflowGraphSchema>;

export function isCoreWorkflowNodeType(value: string): value is CoreWorkflowNodeType {
  return (CORE_WORKFLOW_NODE_TYPES as readonly string[]).includes(value);
}

export function isWorkflowNodeType(value: string): boolean {
  return isValidModuleId(value);
}

export function parseWorkflowNodeType(value: string | undefined): WorkflowNodeType {
  if (value && isValidModuleId(value)) {
    return value;
  }
  return "httpRequest";
}

export function getAllWorkflowNodeTypeIds(): string[] {
  return [...MODULE_IDS];
}
