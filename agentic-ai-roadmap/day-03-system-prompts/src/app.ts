import express from "express";
import programmingRouter from "./modules/programming/programming.route.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    message: "Server is running",
  });
});

app.use(
  "/api/ai/programming",
  programmingRouter
);

export default app;