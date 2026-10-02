import express from "express";
import aiRouter from "./modules/ai/ai.route.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    message: "Server is running",
  });
});

app.use("/api/ai", aiRouter);

export default app;