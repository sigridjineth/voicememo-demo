import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { api } from '@/api';
import { Memo, CreateMemoData, UpdateMemoData, FetchParams } from '@/types';
import { DEFAULTS } from '@/lib/constants';

interface MemoState {
  memos: Memo[];
  currentMemo: Memo | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  filters: {
    category?: string;
    tags?: string[];
    search?: string;
  };

  // Actions
  fetchMemos: (params?: FetchParams) => Promise<void>;
  fetchMoreMemos: () => Promise<void>;
  getMemo: (id: string) => Promise<void>;
  createMemo: (data: CreateMemoData) => Promise<Memo>;
  updateMemo: (id: string, data: UpdateMemoData) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  batchDeleteMemos: (ids: string[]) => Promise<void>;
  setCurrentMemo: (memo: Memo | null) => void;
  setFilters: (filters: Partial<MemoState['filters']>) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  memos: [],
  currentMemo: null,
  isLoading: false,
  error: null,
  hasMore: true,
  total: 0,
  filters: {},
};

export const useMemoStore = create<MemoState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchMemos: async (params) => {
          set({ isLoading: true, error: null });
          try {
            const filters = get().filters;
            const response = await api.memos.list({
              ...filters,
              ...params,
              limit: params?.limit || DEFAULTS.PAGE_SIZE,
            });

            set({
              memos: response.data.items,
              total: response.data.total,
              hasMore: response.data.hasMore,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to fetch memos',
              isLoading: false,
            });
          }
        },

        fetchMoreMemos: async () => {
          const { memos, hasMore, isLoading, filters } = get();
          if (!hasMore || isLoading) return;

          set({ isLoading: true, error: null });
          try {
            const response = await api.memos.list({
              ...filters,
              skip: memos.length,
              limit: DEFAULTS.PAGE_SIZE,
            });

            set({
              memos: [...memos, ...response.data.items],
              hasMore: response.data.hasMore,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to fetch more memos',
              isLoading: false,
            });
          }
        },

        getMemo: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.memos.get(id);
            set({
              currentMemo: response.data,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Failed to fetch memo',
              isLoading: false,
            });
          }
        },

        createMemo: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.memos.create(data);
            const newMemo = response.data;

            set((state) => ({
              memos: [newMemo, ...state.memos],
              total: state.total + 1,
              isLoading: false,
            }));

            return newMemo;
          } catch (error: any) {
            set({
              error: error.message || 'Failed to create memo',
              isLoading: false,
            });
            throw error;
          }
        },

        updateMemo: async (id, data) => {
          // Optimistic update
          set((state) => ({
            memos: state.memos.map((m) =>
              m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
            ),
            currentMemo: state.currentMemo?.id === id
              ? { ...state.currentMemo, ...data, updatedAt: new Date().toISOString() }
              : state.currentMemo,
          }));

          try {
            const response = await api.memos.update(id, data);
            const updatedMemo = response.data;

            set((state) => ({
              memos: state.memos.map((m) => (m.id === id ? updatedMemo : m)),
              currentMemo: state.currentMemo?.id === id ? updatedMemo : state.currentMemo,
            }));
          } catch (error: any) {
            // Revert optimistic update on error
            await get().fetchMemos();
            set({
              error: error.message || 'Failed to update memo',
            });
            throw error;
          }
        },

        deleteMemo: async (id) => {
          // Optimistic update
          set((state) => ({
            memos: state.memos.filter((m) => m.id !== id),
            total: state.total - 1,
            currentMemo: state.currentMemo?.id === id ? null : state.currentMemo,
          }));

          try {
            await api.memos.delete(id);
          } catch (error: any) {
            // Revert on error
            await get().fetchMemos();
            set({
              error: error.message || 'Failed to delete memo',
            });
            throw error;
          }
        },

        batchDeleteMemos: async (ids) => {
          // Optimistic update
          set((state) => ({
            memos: state.memos.filter((m) => !ids.includes(m.id)),
            total: state.total - ids.length,
            currentMemo: state.currentMemo && ids.includes(state.currentMemo.id) 
              ? null 
              : state.currentMemo,
          }));

          try {
            await api.memos.batchDelete(ids);
          } catch (error: any) {
            // Revert on error
            await get().fetchMemos();
            set({
              error: error.message || 'Failed to delete memos',
            });
            throw error;
          }
        },

        setCurrentMemo: (memo) => set({ currentMemo: memo }),

        setFilters: (filters) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
          }));
        },

        clearError: () => set({ error: null }),

        reset: () => set(initialState),
      }),
      {
        name: 'memo-store',
        partialize: (state) => ({ 
          filters: state.filters,
          currentMemo: state.currentMemo,
        }),
      }
    )
  )
);