import type { Request, Response } from "express";
import { programmingQuestionSchema } from "./programming.validation.js";
import { askProgrammingAssistant } from "./programming.service.js";

export async function programmingAssistant(
  req: Request,
  res: Response
) {
  const result = programmingQuestionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten(),
    });
  }

  try {
    const answer = await askProgrammingAssistant(
      result.data.message
    );

    return res.status(200).json({
      answer,
    });
  } catch (error) {
    console.error(
      "Programming assistant error:",
      error
    );

    return res.status(500).json({
      message: "Failed to generate programming response",
    });
  }
}