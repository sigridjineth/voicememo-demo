export * from './client';
export { authApi } from './auth';
export { memosApi } from './memos';
export { voiceApi } from './voice';
export { ragApi } from './rag';

// Aggregate all APIs for convenience
export const api = {
  auth: authApi,
  memos: memosApi,
  voice: voiceApi,
  rag: ragApi,
} as const;