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

export interface CreateServiceRequestDTO {
  title: string;
  description: string;
  priority?: RequestPriority;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}
