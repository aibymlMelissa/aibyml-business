import { Request, Response } from 'express';
import { z } from 'zod';
import { WorkflowService } from '../services/workflow-service.js';
import { CreateServiceRequestDTO, UpdateServiceRequestDTO, RequestStatus } from '../types/index.js';

const createRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional()
});

const updateRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.enum(['technical_support', 'account_management', 'billing', 'general_inquiry', 'complaint', 'feature_request']).optional(),
  assignedTo: z.string().optional(),
  department: z.string().optional()
});

export class ServiceRequestController {
  constructor(private workflowService: WorkflowService) {}

  async createRequest(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createRequestSchema.parse(req.body);
      const request = await this.workflowService.createServiceRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAllRequests(req: Request, res: Response): Promise<void> {
    try {
      const { status, assignedTo } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status as RequestStatus;
      if (assignedTo) filters.assignedTo = assignedTo as string;

      const requests = await this.workflowService.getAllRequests(filters);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.workflowService.getRequestById(id);
      
      if (!request) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateRequestSchema.parse(req.body);
      
      const request = await this.workflowService.updateRequest(id, validatedData);
      
      if (!request) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async registerRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.workflowService.registerRequest(id);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async classifyRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.workflowService.classifyRequest(id);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.workflowService.handleRequest(id);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async closeRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { closedBy } = req.body;
      const request = await this.workflowService.closeRequest(id, closedBy);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async abortRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const request = await this.workflowService.abortRequest(id, reason);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}