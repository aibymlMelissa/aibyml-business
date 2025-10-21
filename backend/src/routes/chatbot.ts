import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbot-controller.js';

export function createChatbotRoutes(): Router {
  const router = Router();
  const controller = new ChatbotController();

  router.post('/conversation', (req, res) => controller.processConversation(req, res));
  router.get('/welcome', (req, res) => controller.getWelcomeMessage(req, res));

  return router;
}