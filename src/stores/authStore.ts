import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { api } from '@/api';
import { STORAGE_KEYS } from '@/lib/constants';
import { User, LoginRequest, RegisterRequest, AuthTokens } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.auth.login(credentials);
            const { accessToken, refreshToken } = response.data;

            // Store tokens
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

            // Fetch user profile
            const userResponse = await api.auth.getCurrentUser();
            
            set({
              user: userResponse.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Login failed',
              isLoading: false,
            });
            throw error;
          }
        },

        register: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.auth.register(data);
            const { accessToken, refreshToken } = response.data;

            // Store tokens
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

            // Fetch user profile
            const userResponse = await api.auth.getCurrentUser();
            
            set({
              user: userResponse.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Registration failed',
              isLoading: false,
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await api.auth.logout();
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            // Clear local storage
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        refreshAuth: async () => {
          const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          set({ isLoading: true });
          try {
            const response = await api.auth.getCurrentUser();
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },

        updateProfile: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.auth.updateProfile(data);
            set({
              user: response.data,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to update profile',
              isLoading: false,
            });
            throw error;
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    )
  )
);