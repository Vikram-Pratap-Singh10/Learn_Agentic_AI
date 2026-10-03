import { Router } from "express";
import { createConversationController, sendMessageController, getConversationController, getMessagesController, } from "./conversation.controller.js";

const router = Router();

router.post("/conversations", createConversationController);
router.post("/conversations/:conversationId/messages", sendMessageController);
router.get("/conversations/:conversationId", getConversationController);
router.get("/conversations/:conversationId/messages", getMessagesController);

export default router;