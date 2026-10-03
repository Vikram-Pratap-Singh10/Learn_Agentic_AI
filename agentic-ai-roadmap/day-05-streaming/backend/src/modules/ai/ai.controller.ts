import type { Request, Response } from "express";
import { createConversation, getConversation, getConversationMessages, sendMessage, } from "./ai.service.js";
import { z } from "zod";

import { streamAIResponse } from "./ai.service.js";

const chatSchema = z.object({
  message: z.string().trim().min(1, "Message is required").max(5000, "Message cannot exceed 5000 characters"),
});
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

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export async function streamChat(req: Request, res: Response) {
  const result = chatSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Validation failed", errors: result.error.flatten() });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    await streamAIResponse(
      result.data.message, (chunk) => { res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`); });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);

    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(`data: ${JSON.stringify({ error: "Failed to generate AI response", })}\n\n`);

    res.end();
  }
}

export async function createConversationController(req: Request, res: Response) {
  const result = createConversationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Validation failed", errors: result.error.flatten(), });
  }

  try {
    const conversation = await createConversation(result.data.userId, result.data.title);

    return res.status(201).json({ message: "Conversation created", conversation, });
  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({ message: "Failed to create conversation", });
  }
}

export async function sendMessageController(req: Request, res: Response) {
  const result = sendMessageSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Validation failed", errors: result.error.flatten(), });
  }

  const conversationId = req.params.conversationId as string;
  if (!conversationId) {
    return res.status(400).json({ message: "Conversation ID is required", });
  }

  try {
    const resultData = await sendMessage(conversationId, result.data.userId, result.data.message);
    return res.status(200).json(resultData);
  } catch (error) {
    console.error("Send message error:", error);

    const message = error instanceof Error ? error.message : "Failed to generate AI response";
    if (message === "Conversation not found") {
      return res.status(404).json({ message, });
    }

    return res.status(500).json({ message: "Failed to generate AI response", });
  }
}

export async function getConversationController(req: Request, res: Response) {
  const conversationId = req.params.conversationId as string;
  const userId = req.query.userId;

  if (!conversationId || typeof userId !== "string") {
    return res.status(400).json({ message: "conversationId and userId are required", });
  }

  try {
    const conversation = await getConversation(conversationId, userId);
    return res.status(200).json({ conversation, });
  } catch (error) {
    console.error("Get conversation error:", error);
    return res.status(404).json({ message: "Conversation not found", });
  }
}

export async function getMessagesController(req: Request, res: Response) {
  const conversationId = req.params.conversationId as string;
  const userId = req.query.userId;

  if (!conversationId || typeof userId !== "string") {
    return res.status(400).json({ message: "conversationId and userId are required", });
  }

  try {
    const messages = await getConversationMessages(conversationId, userId);
    return res.status(200).json({ messages, });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(404).json({ message: "Conversation not found", });
  }
}