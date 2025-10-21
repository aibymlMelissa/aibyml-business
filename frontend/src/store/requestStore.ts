import { create } from 'zustand';
import type { ServiceRequest, CreateServiceRequestDTO } from '../types/index.js';
import { serviceRequestApi } from '../services/api.js';

interface RequestStore {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  selectedRequest: ServiceRequest | null;
  
  fetchRequests: () => Promise<void>;
  createRequest: (data: CreateServiceRequestDTO) => Promise<void>;
  updateRequest: (id: string, data: Partial<ServiceRequest>) => Promise<void>;
  selectRequest: (request: ServiceRequest) => void;
  updateRequestInStore: (request: ServiceRequest) => void;
  addRequestToStore: (request: ServiceRequest) => void;
  setError: (error: string | null) => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  loading: false,
  error: null,
  selectedRequest: null,

  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const requests = await serviceRequestApi.getAllRequests();
      set({ requests, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch requests',
        loading: false 
      });
    }
  },

  createRequest: async (data) => {
    set({ loading: true, error: null });
    try {
      const newRequest = await serviceRequestApi.createRequest(data);
      set(state => ({ 
        requests: [newRequest, ...state.requests],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create request',
        loading: false 
      });
    }
  },

  updateRequest: async (id, data) => {
    try {
      const updatedRequest = await serviceRequestApi.updateRequest(id, data);
      set(state => ({
        requests: state.requests.map(req => 
          req.id === id ? updatedRequest : req
        ),
        selectedRequest: state.selectedRequest?.id === id ? updatedRequest : state.selectedRequest
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update request' });
    }
  },

  selectRequest: (request) => {
    set({ selectedRequest: request });
  },

  updateRequestInStore: (updatedRequest) => {
    set(state => ({
      requests: state.requests.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      ),
      selectedRequest: state.selectedRequest?.id === updatedRequest.id ? updatedRequest : state.selectedRequest
    }));
  },

  addRequestToStore: (newRequest) => {
    set(state => ({ 
      requests: [newRequest, ...state.requests]
    }));
  },

  setError: (error) => {
    set({ error });
  }
}));
