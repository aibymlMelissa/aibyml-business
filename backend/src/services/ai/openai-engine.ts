import OpenAI from 'openai';
import { BaseAIEngine } from './base.js';
import { AIClassificationResult, AIHandlingResult, ServiceRequest, RequestCategory, RequestPriority } from '../../types/index.js';
import { config } from '../../config/index.js';

export class OpenAIEngine extends BaseAIEngine {
  name = 'OpenAI GPT-4';
  type = 'classification' as const;
  private client: OpenAI;

  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: config.ai.openai.apiKey
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

Respond in JSON format:
{
  "category": "...",
  "priority": "...", 
  "confidence": 0.95,
  "reasoning": "...",
  "suggestedDepartment": "..."
}`;

    const response = await this.client.chat.completions.create({
      model: config.ai.openai.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const result = JSON.parse(content);
      return {
        category: result.category as RequestCategory,
        priority: result.priority as RequestPriority,
        confidence: result.confidence,
        reasoning: result.reasoning,
        suggestedDepartment: result.suggestedDepartment
      };
    } catch (error) {
      throw new Error(`Failed to parse OpenAI response: ${error}`);
    }
  }

  async handleRequest(request: ServiceRequest): Promise<AIHandlingResult> {
    const prompt = `
Analyze this classified service request and suggest handling approach:

Title: ${request.title}
Description: ${request.description}
Category: ${request.category}
Priority: ${request.priority}
Department: ${request.department || 'Unassigned'}

Please provide:
1. Recommended action steps
2. Estimated resolution time
3. Confidence score (0.0-1.0)
4. Reasoning
5. Whether human intervention is required

Respond in JSON format:
{
  "recommendedAction": "...",
  "estimatedResolutionTime": "...",
  "confidence": 0.95,
  "reasoning": "...",
  "requiresHumanIntervention": true/false
}`;

    const response = await this.client.chat.completions.create({
      model: config.ai.openai.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 600
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const result = JSON.parse(content);
      return {
        recommendedAction: result.recommendedAction,
        estimatedResolutionTime: result.estimatedResolutionTime,
        confidence: result.confidence,
        reasoning: result.reasoning,
        requiresHumanIntervention: result.requiresHumanIntervention
      };
    } catch (error) {
      throw new Error(`Failed to parse OpenAI response: ${error}`);
    }
  }
}