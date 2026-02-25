import express from 'express';
import { chat, getChatbotOptions } from '../controllers/chatbot.controller.js';

const router = express.Router();

// Chat endpoint - accepts user message and returns chatbot response
router.post("/chat", chat);

// Get chatbot quick options
router.get("/options", getChatbotOptions);

export default router;