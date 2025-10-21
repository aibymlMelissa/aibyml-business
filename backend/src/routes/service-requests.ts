import { Router } from 'express';
import { ServiceRequestController } from '../controllers/service-request-controller.js';
import { WorkflowService } from '../services/workflow-service.js';
import { WebSocketService } from '../services/websocket-service.js';

export function createServiceRequestRoutes(wsService: WebSocketService): Router {
  const router = Router();
  const workflowService = new WorkflowService(wsService);
  const controller = new ServiceRequestController(workflowService);

  router.post('/', (req, res) => controller.createRequest(req, res));
  router.get('/', (req, res) => controller.getAllRequests(req, res));
  router.get('/:id', (req, res) => controller.getRequestById(req, res));
  router.put('/:id', (req, res) => controller.updateRequest(req, res));
  
  router.post('/:id/register', (req, res) => controller.registerRequest(req, res));
  router.post('/:id/classify', (req, res) => controller.classifyRequest(req, res));
  router.post('/:id/handle', (req, res) => controller.handleRequest(req, res));
  router.post('/:id/close', (req, res) => controller.closeRequest(req, res));
  router.post('/:id/abort', (req, res) => controller.abortRequest(req, res));

  return router;
}