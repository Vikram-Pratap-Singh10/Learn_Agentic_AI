import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not configured");
}

const ai = new GoogleGenAI({
    apiKey,
})

export async function askLLM(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            temperature: 0.2,
        },
    })
    return response.text ?? "";
}
