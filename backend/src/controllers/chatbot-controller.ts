import { Request, Response } from 'express';
import { z } from 'zod';
import { ChatbotEngine } from '../services/ai/chatbot-engine.js';

const conversationSchema = z.object({
  message: z.string().min(1),
  conversationHistory: z.array(z.object({
    content: z.string(),
    sender: z.enum(['user', 'bot'])
  })).optional().default([])
});

export class ChatbotController {
  private chatbotEngine: ChatbotEngine;

  constructor() {
    this.chatbotEngine = new ChatbotEngine();
  }

  async processConversation(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = conversationSchema.parse(req.body);
      
      const result = await this.chatbotEngine.processConversation(
        validatedData.message,
        validatedData.conversationHistory
      );

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors,
          response: "I didn't understand that. Could you please try again?"
        });
      } else {
        console.error('Chatbot conversation error:', error);
        res.status(500).json({ 
          error: 'Internal server error',
          response: "I'm sorry, I'm experiencing technical difficulties. Please try again or fill out the form directly."
        });
      }
    }
  }

  async getWelcomeMessage(req: Request, res: Response): Promise<void> {
    try {
      const welcomeMessage = await this.chatbotEngine.generateWelcomeMessage();
      res.json({ message: welcomeMessage });
    } catch (error) {
      console.error('Welcome message error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: "Hi! I'm here to help you create a service request. What can I assist you with today?"
      });
    }
  }
}