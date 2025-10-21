import { OpenAIEngine } from './openai-engine.js';
import { AnthropicEngine } from './anthropic-engine.js';
import { ServiceRequest, AIClassificationResult, AIHandlingResult } from '../../types/index.js';
import { AIProcessingRepository } from '../repositories/ai-processing-repository.js';

export class AIOrchestrator {
  private classificationEngine: OpenAIEngine;
  private handlingEngine: AnthropicEngine;
  private aiProcessingRepo: AIProcessingRepository;

  constructor() {
    this.classificationEngine = new OpenAIEngine();
    this.handlingEngine = new AnthropicEngine();
    this.aiProcessingRepo = new AIProcessingRepository();
  }

  async classifyRequest(request: ServiceRequest): Promise<AIClassificationResult> {
    const { result, processingTime } = await this.classificationEngine.measureProcessingTime(
      () => this.classificationEngine.classify(request)
    );

    await this.aiProcessingRepo.logProcessing({
      requestId: request.id,
      engineName: this.classificationEngine.name,
      engineType: 'classification',
      inputData: { title: request.title, description: request.description },
      outputData: result,
      confidenceScore: result.confidence,
      processingTimeMs: processingTime,
      success: true
    });

    return result;
  }

  async handleRequest(request: ServiceRequest): Promise<AIHandlingResult> {
    const { result, processingTime } = await this.handlingEngine.measureProcessingTime(
      () => this.handlingEngine.handleRequest(request)
    );

    await this.aiProcessingRepo.logProcessing({
      requestId: request.id,
      engineName: this.handlingEngine.name,
      engineType: 'handling',
      inputData: { 
        title: request.title, 
        description: request.description,
        category: request.category,
        priority: request.priority
      },
      outputData: result,
      confidenceScore: result.confidence,
      processingTimeMs: processingTime,
      success: true
    });

    return result;
  }

  async processRequestWithBothEngines(request: ServiceRequest): Promise<{
    classification: AIClassificationResult;
    handling: AIHandlingResult;
  }> {
    try {
      const classification = await this.classifyRequest(request);
      
      const updatedRequest = {
        ...request,
        category: classification.category,
        priority: classification.priority,
        department: classification.suggestedDepartment
      };

      const handling = await this.handleRequest(updatedRequest);

      return { classification, handling };
    } catch (error) {
      await this.aiProcessingRepo.logProcessing({
        requestId: request.id,
        engineName: 'AI Orchestrator',
        engineType: 'classification',
        inputData: request,
        outputData: null,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}