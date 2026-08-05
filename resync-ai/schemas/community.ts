import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email(),
  source: z.string().max(64).optional(),
});

export const newsletterSchema = waitlistSchema;

export const moderateSchema = z.object({
  text: z.string().min(1).max(10000),
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  text: z.string().min(1).max(2000),
});

export const composePostSchema = z.object({
  type: z.enum(["template", "marketplace", "design", "discussion"]),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  priceCents: z.number().int().min(0).optional(),
  templateSlug: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const reportSchema = z.object({
  targetType: z.enum(["post", "user", "comment"]),
  targetId: z.string().min(1),
  reason: z.string().min(1).max(200),
  details: z.string().max(1000).optional(),
});

export const feedbackSchema = z.object({
  category: z.enum(["bug", "feature", "community", "other"]),
  message: z.string().min(1).max(3000),
  email: z.string().email().optional(),
});

export const communitySettingsSchema = z.object({
  emailDigest: z.boolean(),
  notifyReplies: z.boolean(),
  notifyLikes: z.boolean(),
  hideNsfw: z.boolean(),
  hideAbuse: z.boolean(),
  muteWords: z.array(z.string().max(50)).max(20),
  showActivity: z.boolean(),
  blockedUserIds: z.array(z.string()).max(100),
});
