// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Voice
  VOICE_UPLOAD: '/voice/upload',
  VOICE_TRANSCRIBE: '/voice/transcribe',
  VOICE_GET: (id: string) => `/voice/${id}`,

  // Memos
  MEMOS: '/memos',
  MEMO_BY_ID: (id: string) => `/memos/${id}`,

  // Search & RAG
  SEARCH: '/search',
  RAG_QUERY: '/rag/query',
  RAG_SUGGESTIONS: '/rag/suggestions',
} as const;

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  TRANSCRIPTION_PARTIAL: 'transcription.partial',
  TRANSCRIPTION_FINAL: 'transcription.final',
  TRANSCRIPTION_ERROR: 'transcription.error',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
} as const;

// Default Values
export const DEFAULTS = {
  MEMO_CATEGORY: 'General',
  LANGUAGE: 'ko-KR',
  PAGE_SIZE: 20,
  MAX_TAGS: 5,
  MAX_RECORDING_DURATION: parseInt(import.meta.env.VITE_MAX_RECORDING_DURATION || '600'),
  AUDIO_SAMPLE_RATE: parseInt(import.meta.env.VITE_AUDIO_SAMPLE_RATE || '16000'),
} as const;

// Categories
export const CATEGORIES = [
  'General',
  'Work',
  'Personal',
  'Ideas',
  'Meeting',
  'Study',
  'Todo',
  'Other',
] as const;

// Audio Settings
export const AUDIO_CONFIG = {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000,
  sampleRate: DEFAULTS.AUDIO_SAMPLE_RATE,
  numberOfChannels: 1,
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MM/dd',
  MEDIUM: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  RELATIVE: 'relative',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  USER: ['user'],
  MEMOS: ['memos'],
  MEMO: (id: string) => ['memo', id],
  SEARCH: ['search'],
  RAG: ['rag'],
  SUGGESTIONS: ['suggestions'],
} as const;