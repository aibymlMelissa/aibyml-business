export type RequestStatus = 
  | 'new'
  | 'registered' 
  | 'classified'
  | 'request_fulfilled'
  | 'aborted'
  | 'closed';

export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';

export type RequestCategory = 
  | 'technical_support'
  | 'account_management'
  | 'billing'
  | 'general_inquiry'
  | 'complaint'
  | 'feature_request';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  category?: RequestCategory;
  
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  classificationConfidence?: number;
  classificationNotes?: string;
  
  aiClassificationEngine?: string;
  aiHandlingEngine?: string;
  
  createdAt: string;
  updatedAt: string;
  registeredAt?: string;
  classifiedAt?: string;
  fulfilledAt?: string;
  closedAt?: string;
  
  assignedTo?: string;
  department?: string;
}

export interface WorkflowHistory {
  id: string;
  requestId: string;
  fromStatus?: RequestStatus;
  toStatus: RequestStatus;
  changedBy?: string;
  changeReason?: string;
  aiConfidence?: number;
  createdAt: string;
}

export interface AIProcessingLog {
  id: string;
  requestId: string;
  engineName: string;
  engineType: 'classification' | 'handling';
  inputData: any;
  outputData: any;
  confidenceScore?: number;
  processingTimeMs?: number;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
}

export interface RequestUpdate {
  id: string;
  requestId: string;
  updateType: 'comment' | 'status_change' | 'assignment';
  content?: string;
  createdBy?: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CreateServiceRequestDTO {
  title: string;
  description: string;
  priority?: RequestPriority;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface UpdateServiceRequestDTO {
  title?: string;
  description?: string;
  priority?: RequestPriority;
  category?: RequestCategory;
  assignedTo?: string;
  department?: string;
}

export interface AIClassificationResult {
  category: RequestCategory;
  priority: RequestPriority;
  confidence: number;
  reasoning: string;
  suggestedDepartment?: string;
}

export interface AIHandlingResult {
  recommendedAction: string;
  estimatedResolutionTime?: string;
  confidence: number;
  reasoning: string;
  requiresHumanIntervention: boolean;
}