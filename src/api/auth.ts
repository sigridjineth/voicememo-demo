import { apiClient } from './client';
import { API_ENDPOINTS } from '@/lib/constants';
import { 
  ApiResponse, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest, 
  User 
} from '@/types';

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH, { refreshToken });
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(API_ENDPOINTS.ME);
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(API_ENDPOINTS.ME, data);
    return response.data;
  },
};