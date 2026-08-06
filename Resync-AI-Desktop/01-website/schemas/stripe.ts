import { z } from "zod";

export const checkoutTierSchema = z.enum(["starter", "pro", "enterprise"]);

export const checkoutBodySchema = z.object({
  tier: checkoutTierSchema,
  organizationId: z.string().uuid(),
});
