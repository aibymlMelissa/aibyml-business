import axios from 'axios';
import type { ServiceRequest, CreateServiceRequestDTO, RequestStatus } from '../types/index.js';
import { validateServiceRequest, validateServiceRequestArray } from '../utils/validation.js';
import { handleApiError } from '../utils/api-error-handler.js';

const api = axios.create({
  baseURL: 'http://localhost:8010/api',
  timeout: 10000,
});

export const serviceRequestApi = {
  async createRequest(data: CreateServiceRequestDTO): Promise<ServiceRequest> {
    try {
      const response = await api.post('/service-requests', data);
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getAllRequests(filters?: { status?: RequestStatus; assignedTo?: string }): Promise<ServiceRequest[]> {
    try {
      const response = await api.get('/service-requests', { params: filters });
      return validateServiceRequestArray(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getRequestById(id: string): Promise<ServiceRequest> {
    try {
      const response = await api.get(`/service-requests/${id}`);
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      const response = await api.put(`/service-requests/${id}`, data);
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async registerRequest(id: string): Promise<ServiceRequest> {
    try {
      const response = await api.post(`/service-requests/${id}/register`);
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async classifyRequest(id: string): Promise<ServiceRequest> {
    try {
      const response = await api.post(`/service-requests/${id}/classify`);
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async handleRequest(id: string): Promise<ServiceRequest> {
    try {
      const response = await api.post(`/service-requests/${id}/handle`);
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async closeRequest(id: string, closedBy?: string): Promise<ServiceRequest> {
    try {
      const response = await api.post(`/service-requests/${id}/close`, { closedBy });
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async abortRequest(id: string, reason?: string): Promise<ServiceRequest> {
    try {
      const response = await api.post(`/service-requests/${id}/abort`, { reason });
      return validateServiceRequest(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default api;