import "dotenv/config";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not configured");
}

if (!process.env.GOOGLE_GEMINI_MODEL) {
  throw new Error("GOOGLE_GEMINI_MODEL is not configured");
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  googleApiKey: process.env.GOOGLE_API_KEY,
  googleGeminiModel: process.env.GOOGLE_GEMINI_MODEL,
};