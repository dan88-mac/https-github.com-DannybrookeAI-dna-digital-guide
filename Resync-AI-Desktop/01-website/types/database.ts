export type UserRole = "OWNER" | "ADMIN" | "BUILDER" | "VIEWER";
export type SubscriptionTier = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
export type ExecutionStatus =
  | "SUCCESS"
  | "FAILED"
  | "SELF_HEALED"
  | "FALLBACK_TRIGGERED"
  | "QUOTA_EXCEEDED"
  | "TIMEOUT";

export interface WorkflowTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  uses: number;
  graph: { nodes: unknown[]; edges: unknown[] };
}
