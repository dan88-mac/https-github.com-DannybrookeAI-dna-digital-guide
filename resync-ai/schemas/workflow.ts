import { z } from "zod";

export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["httpRequest", "transform", "condition", "selfHeal", "webhookOut"]),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.unknown()),
});

export const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
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
