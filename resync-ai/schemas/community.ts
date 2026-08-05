import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email(),
  source: z.string().max(64).optional(),
});

export const newsletterSchema = waitlistSchema;
