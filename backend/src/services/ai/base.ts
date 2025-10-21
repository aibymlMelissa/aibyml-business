import { AIClassificationResult, AIHandlingResult, ServiceRequest } from '../../types/index.js';

export abstract class BaseAIEngine {
  abstract name: string;
  abstract type: 'classification' | 'handling';
  
  abstract classify(request: ServiceRequest): Promise<AIClassificationResult>;
  abstract handleRequest(request: ServiceRequest): Promise<AIHandlingResult>;
  
  public async measureProcessingTime<T>(operation: () => Promise<T>): Promise<{ result: T; processingTime: number }> {
    const start = Date.now();
    const result = await operation();
    const processingTime = Date.now() - start;
    return { result, processingTime };
  }
}