import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@/api';
import { 
  SearchQuery, 
  SearchResult, 
  RAGQuery, 
  RAGResponse, 
  Message 
} from '@/types';

interface SearchState {
  // Search state
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchError: string | null;

  // RAG chat state
  messages: Message[];
  conversationId: string | null;
  isQuerying: boolean;
  ragError: string | null;
  suggestedQuestions: string[];

  // Actions
  search: (query: SearchQuery) => Promise<void>;
  clearSearch: () => void;
  sendQuery: (query: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  clearConversation: () => void;
  getSuggestions: (context?: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearErrors: () => void;
}

const initialState = {
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchError: null,
  messages: [],
  conversationId: null,
  isQuerying: false,
  ragError: null,
  suggestedQuestions: [],
};

export const useSearchStore = create<SearchState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      search: async (query) => {
        set({ 
          isSearching: true, 
          searchError: null,
          searchQuery: query.query 
        });

        try {
          const response = await api.rag.search(query);
          set({
            searchResults: response.data,
            isSearching: false,
          });
        } catch (error: any) {
          set({
            searchError: error.message || 'Search failed',
            isSearching: false,
          });
        }
      },

      clearSearch: () => {
        set({
          searchQuery: '',
          searchResults: [],
          searchError: null,
        });
      },

      sendQuery: async (query) => {
        const { conversationId, messages } = get();
        
        // Add user message to chat
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: query,
          timestamp: new Date().toISOString(),
        };

        set({
          messages: [...messages, userMessage],
          isQuerying: true,
          ragError: null,
        });

        try {
          const response = await api.rag.query({
            query,
            conversationId: conversationId || undefined,
          });

          const { answer, sources, suggestedQuestions, conversationId: newConversationId } = response.data;

          // Add assistant message
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: answer,
            timestamp: new Date().toISOString(),
            sources,
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            conversationId: newConversationId,
            suggestedQuestions,
            isQuerying: false,
          }));
        } catch (error: any) {
          // Remove the user message on error
          set((state) => ({
            messages: state.messages.slice(0, -1),
            ragError: error.message || 'Failed to process query',
            isQuerying: false,
          }));
        }
      },

      loadConversation: async (conversationId) => {
        set({ isQuerying: true, ragError: null });

        try {
          const response = await api.rag.getConversationHistory(conversationId);
          const { messages } = response.data;

          set({
            messages: messages.map((msg, index) => ({
              id: `${msg.role}-${index}`,
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
            })),
            conversationId,
            isQuerying: false,
          });
        } catch (error: any) {
          set({
            ragError: error.message || 'Failed to load conversation',
            isQuerying: false,
          });
        }
      },

      clearConversation: () => {
        set({
          messages: [],
          conversationId: null,
          suggestedQuestions: [],
          ragError: null,
        });
      },

      getSuggestions: async (context) => {
        try {
          const response = await api.rag.getSuggestions(context);
          set({ suggestedQuestions: response.data });
        } catch (error) {
          console.error('Failed to get suggestions:', error);
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      clearErrors: () => set({ searchError: null, ragError: null }),
    }),
    {
      name: 'search-store',
    }
  )
);