import Anthropic from '@anthropic-ai/sdk';
import { BaseAIEngine } from './base.js';
import { AIClassificationResult, AIHandlingResult, ServiceRequest, RequestCategory, RequestPriority } from '../../types/index.js';
import { config } from '../../config/index.js';

export class AnthropicEngine extends BaseAIEngine {
  name = 'Anthropic Claude';
  type = 'handling' as const;
  private client: Anthropic;

  constructor() {
    super();
    this.client = new Anthropic({
      apiKey: config.ai.anthropic.apiKey
    });
  }

  async classify(request: ServiceRequest): Promise<AIClassificationResult> {
    const prompt = `
Analyze this service request and classify it:

Title: ${request.title}
Description: ${request.description}
Customer: ${request.customerEmail || 'Unknown'}

Please classify this request with:
1. Category (technical_support, account_management, billing, general_inquiry, complaint, feature_request)
2. Priority (low, medium, high, critical)
3. Confidence score (0.0-1.0)
4. Reasoning for your classification
5. Suggested department if applicable

Respond in JSON format only:
{
  "category": "...",
  "priority": "...", 
  "confidence": 0.95,
  "reasoning": "...",
  "suggestedDepartment": "..."
}`;

    const response = await this.client.messages.create({
      model: config.ai.anthropic.model,
      max_tokens: 500,
      temperature: 0.1,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    try {
      const result = JSON.parse(content.text);
      return {
        category: result.category as RequestCategory,
        priority: result.priority as RequestPriority,
        confidence: result.confidence,
        reasoning: result.reasoning,
        suggestedDepartment: result.suggestedDepartment
      };
    } catch (error) {
      throw new Error(`Failed to parse Anthropic response: ${error}`);
    }
  }

  async handleRequest(request: ServiceRequest): Promise<AIHandlingResult> {
    const prompt = `
Analyze this classified service request and provide detailed handling recommendations:

Title: ${request.title}
Description: ${request.description}
Category: ${request.category}
Priority: ${request.priority}
Department: ${request.department || 'Unassigned'}
Customer: ${request.customerEmail || 'Unknown'}

Please provide:
1. Detailed recommended action steps
2. Estimated resolution time
3. Confidence score (0.0-1.0)
4. Detailed reasoning
5. Whether human intervention is required

Respond in JSON format only:
{
  "recommendedAction": "...",
  "estimatedResolutionTime": "...",
  "confidence": 0.95,
  "reasoning": "...",
  "requiresHumanIntervention": true/false
}`;

    const response = await this.client.messages.create({
      model: config.ai.anthropic.model,
      max_tokens: 700,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    try {
      const result = JSON.parse(content.text);
      return {
        recommendedAction: result.recommendedAction,
        estimatedResolutionTime: result.estimatedResolutionTime,
        confidence: result.confidence,
        reasoning: result.reasoning,
        requiresHumanIntervention: result.requiresHumanIntervention
      };
    } catch (error) {
      throw new Error(`Failed to parse Anthropic response: ${error}`);
    }
  }
}