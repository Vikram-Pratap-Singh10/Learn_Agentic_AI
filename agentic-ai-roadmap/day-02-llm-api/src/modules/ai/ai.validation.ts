import { z } from "zod";

export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must not exceed 5000 characters"),
});

export type ChatInput = z.infer<typeof chatSchema>;