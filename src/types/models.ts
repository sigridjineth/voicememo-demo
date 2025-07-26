export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  language: string;
  autoTranscribe: boolean;
  defaultCategory: string;
}

export interface Memo {
  id: string;
  userId: string;
  title: string;
  content: string;
  audioUrl?: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  duration?: number; // in seconds
  embeddingId?: string;
}

export interface CreateMemoData {
  title?: string;
  content: string;
  audioUrl?: string;
  tags?: string[];
  category?: string;
  duration?: number;
}

export interface UpdateMemoData {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string;
}

export interface FetchParams {
  skip?: number;
  limit?: number;
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery {
  query: string;
  limit?: number;
  filters?: {
    category?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
  };
}

export interface SearchResult {
  memo: Memo;
  score: number;
  highlights: string[];
}

export interface RAGQuery {
  query: string;
  conversationId?: string;
  maxResults?: number;
}

export interface RAGResponse {
  answer: string;
  sources: Array<{
    memoId: string;
    content: string;
    relevance: number;
  }>;
  suggestedQuestions: string[];
  conversationId: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: RAGResponse['sources'];
}

export interface AudioRecording {
  blob: Blob;
  duration: number;
  url: string;
}