import { apiClient } from './client';
import { API_ENDPOINTS } from '@/lib/constants';
import { 
  ApiResponse, 
  PaginatedResponse, 
  Memo, 
  CreateMemoData, 
  UpdateMemoData, 
  FetchParams 
} from '@/types';

export const memosApi = {
  list: async (params?: FetchParams): Promise<ApiResponse<PaginatedResponse<Memo>>> => {
    const response = await apiClient.get(API_ENDPOINTS.MEMOS, { params });
    return response.data;
  },

  get: async (id: string): Promise<ApiResponse<Memo>> => {
    const response = await apiClient.get(API_ENDPOINTS.MEMO_BY_ID(id));
    return response.data;
  },

  create: async (data: CreateMemoData): Promise<ApiResponse<Memo>> => {
    const response = await apiClient.post(API_ENDPOINTS.MEMOS, data);
    return response.data;
  },

  update: async (id: string, data: UpdateMemoData): Promise<ApiResponse<Memo>> => {
    const response = await apiClient.put(API_ENDPOINTS.MEMO_BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(API_ENDPOINTS.MEMO_BY_ID(id));
    return response.data;
  },

  // Batch operations
  batchDelete: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await apiClient.post(`${API_ENDPOINTS.MEMOS}/batch-delete`, { ids });
    return response.data;
  },

  // Export memos
  export: async (format: 'json' | 'csv' | 'txt', ids?: string[]): Promise<Blob> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.MEMOS}/export`,
      { format, ids },
      { responseType: 'blob' }
    );
    return response.data;
  },
};