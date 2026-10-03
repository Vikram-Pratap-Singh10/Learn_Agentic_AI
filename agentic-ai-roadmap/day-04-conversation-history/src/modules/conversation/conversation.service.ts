import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";

import { env } from "../../config/env.js";

import { Conversation } from "./conversation.model.js";
import { Message } from "./message.model.js";

const ai = new GoogleGenAI({
  apiKey: env.googleApiKey,
});

const SYSTEM_INSTRUCTION = `
You are a senior Node.js and MERN stack developer.

Rules:
- Explain concepts clearly.
- Give practical examples.
- Prefer TypeScript for code examples.
- Keep answers technically accurate.
- Remember and use the conversation context.
- If the user's question refers to previous messages, use the conversation history.
- If you do not have enough information, say so instead of inventing details.
`;

export async function createConversation(userId: string, title?: string) {
  const conversation = await Conversation.create({
    userId,
    title,
  });

  return conversation;
}

export async function getConversation(conversationId: string, userId: string) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return conversation;
}

export async function getConversationMessages(conversationId: string, userId: string) {
  await getConversation(conversationId, userId);

  const messages = await Message.find({ conversationId, userId, })
    .sort({ createdAt: 1 })
    .lean();

  return messages;
}

export async function sendMessage(conversationId: string, userId: string, userMessage: string) {
  const conversation = await Conversation.findOne({ _id: conversationId, userId, });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const previousMessages = await Message.find({ conversationId, userId, })
    .sort({ createdAt: 1 })
    .lean();

  const contents = previousMessages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));

  contents.push({
    role: "user",
    parts: [
      {
        text: userMessage,
      },
    ],
  });

  const response = await ai.models.generateContent({
    model: env.googleGeminiModel,

    contents,

    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  const assistantMessage = response.text?.trim();

  if (!assistantMessage) {
    throw new Error("Gemini returned an empty response");
  }

  await Message.create({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    userId,
    role: "user",
    content: userMessage,
  });

  await Message.create({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    userId,
    role: "assistant",
    content: assistantMessage,
  });

  return {
    answer: assistantMessage,
  };
}