export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: any;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TranscriptionRequest {
  audioData: Blob | ArrayBuffer;
  language?: string;
  enablePunctuation?: boolean;
}

export interface TranscriptionResponse {
  text: string;
  confidence: number;
  duration: number;
  language: string;
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
}

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
}

export interface TranscriptionUpdate {
  text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
}