import { DatabaseConnection } from '../../database/connection.js';
import { ServiceRequest, CreateServiceRequestDTO, UpdateServiceRequestDTO, RequestStatus } from '../../types/index.js';
import { DateConverter } from '../../utils/date-converter.js';

export class ServiceRequestRepository {
  private db = DatabaseConnection.getInstance();

  async create(data: CreateServiceRequestDTO): Promise<ServiceRequest> {
    const query = `
      INSERT INTO service_requests (title, description, priority, customer_name, customer_email, customer_phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      data.title,
      data.description,
      data.priority || 'medium',
      data.customerName,
      data.customerEmail,
      data.customerPhone
    ];

    const result = await this.db.query(query, values);
    return this.mapRowToServiceRequest(result.rows[0]);
  }

  async findById(id: string): Promise<ServiceRequest | null> {
    const query = 'SELECT * FROM service_requests WHERE id = $1';
    const result = await this.db.query(query, [id]);
    
    return result.rows.length > 0 ? this.mapRowToServiceRequest(result.rows[0]) : null;
  }

  async findAll(filters?: { status?: RequestStatus; assignedTo?: string }): Promise<ServiceRequest[]> {
    let query = 'SELECT * FROM service_requests';
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters?.status) {
      conditions.push(`status = $${values.length + 1}`);
      values.push(filters.status);
    }

    if (filters?.assignedTo) {
      conditions.push(`assigned_to = $${values.length + 1}`);
      values.push(filters.assignedTo);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.db.query(query, values);
    return result.rows.map(row => this.mapRowToServiceRequest(row));
  }

  async update(id: string, data: UpdateServiceRequestDTO): Promise<ServiceRequest | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${this.camelToSnake(key)} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE service_requests 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    values.push(id);

    const result = await this.db.query(query, values);
    return result.rows.length > 0 ? this.mapRowToServiceRequest(result.rows[0]) : null;
  }

  async updateStatus(id: string, status: RequestStatus, changedBy?: string): Promise<ServiceRequest | null> {
    const statusTimestampField = this.getStatusTimestampField(status);
    
    let query = `
      UPDATE service_requests 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
    `;
    const values: any[] = [status];

    if (statusTimestampField) {
      query += `, ${statusTimestampField} = CURRENT_TIMESTAMP`;
    }

    query += ` WHERE id = $2 RETURNING *`;
    values.push(id);

    const result = await this.db.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }

    const updatedRequest = this.mapRowToServiceRequest(result.rows[0]);
    
    await this.logWorkflowChange(id, status, changedBy);
    
    return updatedRequest;
  }

  private async logWorkflowChange(requestId: string, toStatus: RequestStatus, changedBy?: string): Promise<void> {
    const currentRequest = await this.findById(requestId);
    if (!currentRequest) return;

    const query = `
      INSERT INTO workflow_history (request_id, from_status, to_status, changed_by)
      VALUES ($1, $2, $3, $4)
    `;
    
    await this.db.query(query, [requestId, currentRequest.status, toStatus, changedBy]);
  }

  private getStatusTimestampField(status: RequestStatus): string | null {
    const statusMap: Record<RequestStatus, string | null> = {
      'new': null,
      'registered': 'registered_at',
      'classified': 'classified_at',
      'request_fulfilled': 'fulfilled_at',
      'aborted': null,
      'closed': 'closed_at'
    };
    
    return statusMap[status];
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  private mapRowToServiceRequest(row: any): ServiceRequest {
    const baseRequest = {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      category: row.category,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      classificationConfidence: row.classification_confidence,
      classificationNotes: row.classification_notes,
      aiClassificationEngine: row.ai_classification_engine,
      aiHandlingEngine: row.ai_handling_engine,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      registeredAt: row.registered_at,
      classifiedAt: row.classified_at,
      fulfilledAt: row.fulfilled_at,
      closedAt: row.closed_at,
      assignedTo: row.assigned_to,
      department: row.department
    };

    return DateConverter.convertServiceRequestDates(baseRequest);
  }
}