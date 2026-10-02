import "dotenv/config";

const requiredEnv = [
  "GOOGLE_API_KEY",
  "GOOGLE_GEMINI_MODEL",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`${key} is not configured`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  googleApiKey: process.env.GOOGLE_API_KEY!,
  googleGeminiModel: process.env.GOOGLE_GEMINI_MODEL!,
};