import express from "express";

import conversationRouter from "./modules/conversation/conversation.route.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    message: "Server is running",
  });
});

app.use("/api/ai", conversationRouter);

export default app;