import { z } from "zod";

export const createConversationSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),

  title: z
    .string()
    .trim()
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
});

export const sendMessageSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message cannot exceed 5000 characters"),
});

export type CreateConversationInput = z.infer<
  typeof createConversationSchema
>;

export type SendMessageInput = z.infer<typeof sendMessageSchema>;