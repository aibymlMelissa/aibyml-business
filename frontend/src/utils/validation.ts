import { z } from 'zod';

// Validation schemas matching the backend types
export const RequestStatusSchema = z.enum([
  'new',
  'registered',
  'classified', 
  'request_fulfilled',
  'aborted',
  'closed'
]);

export const RequestPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const RequestCategorySchema = z.enum([
  'technical_support',
  'account_management',
  'billing',
  'general_inquiry',
  'complaint',
  'feature_request'
]);

export const ServiceRequestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: RequestStatusSchema,
  priority: RequestPrioritySchema,
  category: RequestCategorySchema.optional(),
  
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  
  classificationConfidence: z.number().min(0).max(1).optional(),
  classificationNotes: z.string().optional(),
  
  aiClassificationEngine: z.string().optional(),
  aiHandlingEngine: z.string().optional(),
  
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  registeredAt: z.string().datetime().optional(),
  classifiedAt: z.string().datetime().optional(),
  fulfilledAt: z.string().datetime().optional(),
  closedAt: z.string().datetime().optional(),
  
  assignedTo: z.string().optional(),
  department: z.string().optional()
});

export const ServiceRequestArraySchema = z.array(ServiceRequestSchema);

export const CreateServiceRequestDTOSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  priority: RequestPrioritySchema.optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional()
});

// Validation helper functions
export function validateServiceRequest(data: unknown) {
  return ServiceRequestSchema.parse(data);
}

export function validateServiceRequestArray(data: unknown) {
  return ServiceRequestArraySchema.parse(data);
}

export function validateCreateServiceRequestDTO(data: unknown) {
  return CreateServiceRequestDTOSchema.parse(data);
}

// Safe validation functions that return errors instead of throwing
export function safeValidateServiceRequest(data: unknown) {
  return ServiceRequestSchema.safeParse(data);
}

export function safeValidateServiceRequestArray(data: unknown) {
  return ServiceRequestArraySchema.safeParse(data);
}