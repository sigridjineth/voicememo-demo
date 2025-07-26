import { apiClient, createFormData, uploadFile } from './client';
import { API_ENDPOINTS } from '@/lib/constants';
import { 
  ApiResponse, 
  TranscriptionRequest, 
  TranscriptionResponse 
} from '@/types';

export const voiceApi = {
  upload: async (
    audioFile: File | Blob, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ url: string; id: string }>> => {
    const formData = createFormData({ audio: audioFile });
    const response = await uploadFile(API_ENDPOINTS.VOICE_UPLOAD, formData, onProgress);
    return response.data;
  },

  transcribe: async (data: TranscriptionRequest): Promise<ApiResponse<TranscriptionResponse>> => {
    const formData = createFormData({
      audio: data.audioData,
      language: data.language,
      enablePunctuation: data.enablePunctuation,
    });

    const response = await apiClient.post(API_ENDPOINTS.VOICE_TRANSCRIBE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAudioFile: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(API_ENDPOINTS.VOICE_GET(id), {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteAudioFile: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(API_ENDPOINTS.VOICE_GET(id));
    return response.data;
  },

  // Stream transcription for real-time processing
  streamTranscribe: async (
    audioStream: ReadableStream,
    options?: {
      language?: string;
      onPartialResult?: (text: string) => void;
      onFinalResult?: (text: string) => void;
    }
  ): Promise<void> => {
    // This would typically connect to a WebSocket endpoint
    // Implementation depends on backend WebSocket setup
    console.warn('Stream transcription not yet implemented');
  },
};