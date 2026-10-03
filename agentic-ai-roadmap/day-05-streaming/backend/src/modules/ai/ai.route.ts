import { Router } from "express";
import { createConversationController, sendMessageController, getConversationController, getMessagesController, streamChat } from "./ai.controller.js";

const router = Router();

router.post("/chat/stream", streamChat);

router.post("/conversations", createConversationController);
router.post("/conversations/:conversationId/messages", sendMessageController);
router.get("/conversations/:conversationId", getConversationController);
router.get("/conversations/:conversationId/messages", getMessagesController);

export default router;