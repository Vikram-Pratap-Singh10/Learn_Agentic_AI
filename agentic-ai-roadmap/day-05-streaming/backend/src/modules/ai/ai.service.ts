import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import { Conversation } from "./ai.model.js";
import { Message } from "./message.model.js";
import { env } from "../../config/env.js";

const ai = new GoogleGenAI({
  apiKey: env.googleApiKey,
});

const SYSTEM_INSTRUCTION = `
You are a helpful senior Node.js developer.

Rules:
- Give technically accurate answers.
- Explain concepts clearly.
- Prefer practical TypeScript examples.
- Keep answers understandable for a professional MERN developer.
`;

export async function streamAIResponse(message: string, onChunk: (chunk: string) => void) {
  const response = await ai.models.generateContentStream({
    model: env.googleGeminiModel,

    contents: message,

    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  for await (const chunk of response) {
    const text = chunk.text;

    if (text) {
      onChunk(text);
    }
  }
}


const SYSTEM_INSTRUCTION1 = `
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
  const conversation = await Conversation.create({ userId: userId, title: title, });
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

  const contents = previousMessages.map((message: any) => ({
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
      systemInstruction: SYSTEM_INSTRUCTION1,
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