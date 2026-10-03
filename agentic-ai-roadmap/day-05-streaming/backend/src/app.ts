import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import aiRouter from "./modules/ai/ai.route.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({ message: "Server is running", });
});

app.use("/api/ai", aiRouter);

export default app;