import { z } from "zod";

export const runtimeExecuteSchema = z.object({
  organizationId: z.string().uuid(),
  workflowExecutionId: z.string().uuid().optional(),
  failedEndpoint: z.string().url(),
  errorMessage: z.string().min(1).max(8000),
  expectedOutputSchema: z.record(z.unknown()),
  incomingContext: z.record(z.unknown()),
  attempt: z.number().int().min(0).max(10).optional(),
});

export type RuntimeExecuteInput = z.infer<typeof runtimeExecuteSchema>;
