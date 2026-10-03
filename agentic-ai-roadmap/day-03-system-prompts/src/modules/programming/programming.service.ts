import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import {
  PROGRAMMING_SYSTEM_PROMPT,
} from "./programming.prompt.js";

const ai = new GoogleGenAI({
  apiKey: env.googleApiKey,
});

const SYSTEM_INSTRUCTION = `
You are a senior Node.js developer.

Rules:
- Explain concepts clearly.
- Explain concepts with practical examples.
- Prefer TypeScript for code examples.
- Use Node.js and modern backend development practices.
- Keep explanations understandable for a MERN stack developer.
- When providing code, explain the important parts.
`;

export async function askProgrammingAssistant(
  message: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: env.googleGeminiModel,
    contents: message,
    config: {
    //   systemInstruction: SYSTEM_INSTRUCTION,
      systemInstruction: PROGRAMMING_SYSTEM_PROMPT,
    },
  });

  return response.text ?? "";
}