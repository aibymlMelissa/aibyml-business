import { BaseAIEngine } from './base.js';
import { ServiceRequest, AIClassificationResult, AIHandlingResult, CreateServiceRequestDTO } from '../../types/index.js';
import { config } from '../../config/index.js';
import Anthropic from '@anthropic-ai/sdk';

interface ConversationMessage {
  content: string;
  sender: 'user' | 'bot';
}

interface ChatbotResponse {
  response: string;
  suggestedFormData?: Partial<CreateServiceRequestDTO>;
  shouldTransitionToForm?: boolean;
  confidence: number;
}

export class ChatbotEngine extends BaseAIEngine {
  name = 'Chatbot Assistant';
  type = 'handling' as const;
  private client: Anthropic;

  constructor() {
    super();
    this.client = new Anthropic({
      apiKey: config.ai.anthropic.apiKey
    });
  }

  async classify(request: ServiceRequest): Promise<AIClassificationResult> {
    throw new Error('Chatbot engine does not support classification');
  }

  async handleRequest(request: ServiceRequest): Promise<AIHandlingResult> {
    throw new Error('Chatbot engine does not support direct request handling');
  }

  async processConversation(
    message: string, 
    conversationHistory: ConversationMessage[]
  ): Promise<ChatbotResponse> {
    const conversationContext = conversationHistory
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n');

    const prompt = `
You are an AI assistant helping users create service requests. You should:

1. Ask clarifying questions to understand their issue
2. Gather information needed for the service request form:
   - Title (brief description)
   - Description (detailed explanation) 
   - Priority (low/medium/high/critical)
   - Customer name, email, phone (if provided)
3. When you have enough information, suggest transitioning to the form
4. Be conversational, helpful, and empathetic

Previous conversation:
${conversationContext}

User's latest message: ${message}

Analyze if you have enough information to pre-fill a service request form. If so, extract:
- title: A brief title for the request
- description: A detailed description
- priority: Estimated priority level
- customerName, customerEmail, customerPhone: If mentioned

Respond in JSON format:
{
  "response": "Your conversational response to the user",
  "suggestedFormData": {
    "title": "...",
    "description": "...",
    "priority": "medium",
    "customerName": "...",
    "customerEmail": "...",
    "customerPhone": "..."
  },
  "shouldTransitionToForm": true/false,
  "confidence": 0.0-1.0
}

Only include suggestedFormData if you have meaningful information to pre-fill.
Set shouldTransitionToForm to true only when you have sufficient information and the user seems ready.`;

    try {
      const response = await this.client.messages.create({
        model: config.ai.anthropic.model,
        max_tokens: 800,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic');
      }

      const result = JSON.parse(content.text);
      return {
        response: result.response,
        suggestedFormData: result.suggestedFormData,
        shouldTransitionToForm: result.shouldTransitionToForm || false,
        confidence: result.confidence || 0.8
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        response: "I'm sorry, I'm having trouble processing your request right now. Could you please try again or fill out the form directly?",
        confidence: 0.0
      };
    }
  }

  async generateWelcomeMessage(): Promise<string> {
    const welcomeMessages = [
      "Hi! I'm here to help you create a service request. What can I assist you with today?",
      "Hello! I'm your AI assistant. Tell me about the issue you're experiencing and I'll help you get it resolved.",
      "Welcome! I can help you submit a service request. What seems to be the problem?",
      "Hi there! I'm ready to help you with your service request. What's going on?"
    ];
    
    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }
}