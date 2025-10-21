import { ServiceRequestRepository } from './repositories/service-request-repository.js';
import { AIOrchestrator } from './ai/ai-orchestrator.js';
import { WebSocketService } from './websocket-service.js';
import { ServiceRequest, CreateServiceRequestDTO, UpdateServiceRequestDTO, RequestStatus } from '../types/index.js';

export class WorkflowService {
  private serviceRequestRepo: ServiceRequestRepository;
  private aiOrchestrator: AIOrchestrator;
  private wsService: WebSocketService;

  constructor(wsService: WebSocketService) {
    this.serviceRequestRepo = new ServiceRequestRepository();
    this.aiOrchestrator = new AIOrchestrator();
    this.wsService = wsService;
  }

  async createServiceRequest(data: CreateServiceRequestDTO): Promise<ServiceRequest> {
    const request = await this.serviceRequestRepo.create(data);
    
    this.wsService.broadcast('request_created', request);
    
    this.processRequestAsync(request.id);
    
    return request;
  }

  async registerRequest(requestId: string): Promise<ServiceRequest> {
    const request = await this.serviceRequestRepo.updateStatus(requestId, 'registered', 'system');
    if (!request) {
      throw new Error('Request not found');
    }

    this.wsService.broadcast('request_registered', request);
    return request;
  }

  async classifyRequest(requestId: string): Promise<ServiceRequest> {
    const request = await this.serviceRequestRepo.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    const classification = await this.aiOrchestrator.classifyRequest(request);
    
    const updatedRequest = await this.serviceRequestRepo.update(requestId, {
      category: classification.category,
      priority: classification.priority,
      department: classification.suggestedDepartment
    });

    if (!updatedRequest) {
      throw new Error('Failed to update request');
    }

    const classifiedRequest = await this.serviceRequestRepo.updateStatus(requestId, 'classified', 'ai_system');
    
    this.wsService.broadcast('request_classified', classifiedRequest);
    
    return classifiedRequest!;
  }

  async handleRequest(requestId: string): Promise<ServiceRequest> {
    const request = await this.serviceRequestRepo.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    const handling = await this.aiOrchestrator.handleRequest(request);
    
    const finalStatus = handling.requiresHumanIntervention ? 'aborted' : 'request_fulfilled';
    const handledRequest = await this.serviceRequestRepo.updateStatus(requestId, finalStatus, 'ai_system');
    
    this.wsService.broadcast('request_handled', { 
      request: handledRequest, 
      handling,
      requiresHuman: handling.requiresHumanIntervention 
    });
    
    return handledRequest!;
  }

  async closeRequest(requestId: string, closedBy?: string): Promise<ServiceRequest> {
    const closedRequest = await this.serviceRequestRepo.updateStatus(requestId, 'closed', closedBy || 'system');
    if (!closedRequest) {
      throw new Error('Request not found');
    }

    this.wsService.broadcast('request_closed', closedRequest);
    return closedRequest;
  }

  async abortRequest(requestId: string, reason?: string): Promise<ServiceRequest> {
    const abortedRequest = await this.serviceRequestRepo.updateStatus(requestId, 'aborted', 'system');
    if (!abortedRequest) {
      throw new Error('Request not found');
    }

    this.wsService.broadcast('request_aborted', { request: abortedRequest, reason });
    return abortedRequest;
  }

  private async processRequestAsync(requestId: string): Promise<void> {
    try {
      await this.registerRequest(requestId);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.classifyRequest(requestId);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await this.handleRequest(requestId);
      
    } catch (error) {
      console.error(`Error processing request ${requestId}:`, error);
      await this.abortRequest(requestId, error instanceof Error ? error.message : 'Processing failed');
    }
  }

  async getAllRequests(filters?: { status?: RequestStatus; assignedTo?: string }): Promise<ServiceRequest[]> {
    return this.serviceRequestRepo.findAll(filters);
  }

  async getRequestById(id: string): Promise<ServiceRequest | null> {
    return this.serviceRequestRepo.findById(id);
  }

  async updateRequest(id: string, data: UpdateServiceRequestDTO): Promise<ServiceRequest | null> {
    const updatedRequest = await this.serviceRequestRepo.update(id, data);
    if (updatedRequest) {
      this.wsService.broadcast('request_updated', updatedRequest);
    }
    return updatedRequest;
  }
}