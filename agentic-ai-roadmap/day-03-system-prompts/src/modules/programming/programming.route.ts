import { Router } from "express";
import { programmingAssistant } from "./programming.controller.js";

const router = Router();

router.post("/chat", programmingAssistant);

export default router;