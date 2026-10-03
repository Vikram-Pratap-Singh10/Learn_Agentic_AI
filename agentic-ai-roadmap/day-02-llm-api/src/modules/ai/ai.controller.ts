import type { Request, Response } from "express";
import { chatSchema } from "./ai.validation.js";
import { generateChatResponse } from "./ai.service.js";

export async function chat(req: Request, res: Response) {
    const result = chatSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Validation failed", errors: result.error.flatten(), });
    }
    try {
        const startTime = Date.now();
        const answer = await generateChatResponse(result.data.message);
        const duration = Date.now() - startTime;

        console.log(`AI response time: ${duration}ms`);
        return res.status(200).json({ answer, });
    } catch (error) {
        console.error("Gemini API error:", error);
        return res.status(500).json({ message: "Failed to generate AI response", });
    }
}