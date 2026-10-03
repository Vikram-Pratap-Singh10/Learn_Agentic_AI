import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";

const ai = new GoogleGenAI({
  apiKey: env.googleApiKey,
});

export async function generateChatResponse(  message: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: env.googleGeminiModel,
    contents: message,
    config: {
      // systemInstruction:
      //   "You are a helpful AI assistant for software developers. " +
      //   "Give clear, practical and technically accurate answers.",
      systemInstruction: `
      You are a senior Node.js and TypeScript developer.

      Rules:
      - Give technically accurate answers.
      - Prefer practical examples.
      - Use TypeScript when providing code.
      - Explain complex concepts simply.
      - Do not invent APIs or library behavior.
      `,
    },
  });

  return response.text ?? "";
}