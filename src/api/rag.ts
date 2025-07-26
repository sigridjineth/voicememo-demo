import { apiClient } from './client';
import { API_ENDPOINTS } from '@/lib/constants';
import { 
  ApiResponse, 
  SearchQuery, 
  SearchResult, 
  RAGQuery, 
  RAGResponse 
} from '@/types';

export const ragApi = {
  search: async (query: SearchQuery): Promise<ApiResponse<SearchResult[]>> => {
    const response = await apiClient.post(API_ENDPOINTS.SEARCH, query);
    return response.data;
  },

  query: async (data: RAGQuery): Promise<ApiResponse<RAGResponse>> => {
    const response = await apiClient.post(API_ENDPOINTS.RAG_QUERY, data);
    return response.data;
  },

  getSuggestions: async (context?: string): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.RAG_SUGGESTIONS, {
      params: { context },
    });
    return response.data;
  },

  // Advanced search with filters
  advancedSearch: async (params: {
    query: string;
    filters?: {
      categories?: string[];
      tags?: string[];
      dateRange?: {
        from: string;
        to: string;
      };
      hasAudio?: boolean;
    };
    sort?: {
      field: 'relevance' | 'createdAt' | 'updatedAt';
      order: 'asc' | 'desc';
    };
    pagination?: {
      skip: number;
      limit: number;
    };
  }): Promise<ApiResponse<{
    results: SearchResult[];
    total: number;
    facets?: {
      categories: Record<string, number>;
      tags: Record<string, number>;
    };
  }>> => {
    const response = await apiClient.post(`${API_ENDPOINTS.SEARCH}/advanced`, params);
    return response.data;
  },

  // Get conversation history
  getConversationHistory: async (conversationId: string): Promise<ApiResponse<{
    id: string;
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
    }>;
    createdAt: string;
  }>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.RAG_QUERY}/conversations/${conversationId}`);
    return response.data;
  },
};