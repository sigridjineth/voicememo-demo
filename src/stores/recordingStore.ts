import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@/api';
import { DEFAULTS } from '@/lib/constants';

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // in seconds
  audioBlob: Blob | null;
  audioUrl: string | null;
  transcription: string;
  interimTranscription: string;
  isTranscribing: boolean;
  uploadProgress: number;
  error: string | null;

  // Actions
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: (blob: Blob, duration: number) => void;
  updateDuration: (duration: number) => void;
  updateTranscription: (text: string, isFinal: boolean) => void;
  transcribeAudio: (blob: Blob) => Promise<string>;
  uploadAudio: (blob: Blob) => Promise<{ url: string; id: string }>;
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  isRecording: false,
  isPaused: false,
  duration: 0,
  audioBlob: null,
  audioUrl: null,
  transcription: '',
  interimTranscription: '',
  isTranscribing: false,
  uploadProgress: 0,
  error: null,
};

export const useRecordingStore = create<RecordingState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      startRecording: () => {
        set({
          isRecording: true,
          isPaused: false,
          duration: 0,
          error: null,
        });
      },

      pauseRecording: () => {
        set({ isPaused: true });
      },

      resumeRecording: () => {
        set({ isPaused: false });
      },

      stopRecording: (blob, duration) => {
        const audioUrl = URL.createObjectURL(blob);
        set({
          isRecording: false,
          isPaused: false,
          audioBlob: blob,
          audioUrl,
          duration,
        });
      },

      updateDuration: (duration) => {
        const maxDuration = DEFAULTS.MAX_RECORDING_DURATION;
        if (duration >= maxDuration) {
          // Auto-stop recording when max duration is reached
          set({
            isRecording: false,
            duration: maxDuration,
            error: `Maximum recording duration (${maxDuration}s) reached`,
          });
        } else {
          set({ duration });
        }
      },

      updateTranscription: (text, isFinal) => {
        if (isFinal) {
          set((state) => ({
            transcription: state.transcription + ' ' + text,
            interimTranscription: '',
          }));
        } else {
          set({ interimTranscription: text });
        }
      },

      transcribeAudio: async (blob) => {
        set({ isTranscribing: true, error: null });
        try {
          const response = await api.voice.transcribe({
            audioData: blob,
            language: DEFAULTS.LANGUAGE,
            enablePunctuation: true,
          });

          const transcription = response.data.text;
          set({
            transcription,
            isTranscribing: false,
          });

          return transcription;
        } catch (error: any) {
          set({
            error: error.message || 'Failed to transcribe audio',
            isTranscribing: false,
          });
          throw error;
        }
      },

      uploadAudio: async (blob) => {
        set({ uploadProgress: 0, error: null });
        try {
          const response = await api.voice.upload(blob, (progress) => {
            set({ uploadProgress: progress });
          });

          set({ uploadProgress: 100 });
          return response.data;
        } catch (error: any) {
          set({
            error: error.message || 'Failed to upload audio',
            uploadProgress: 0,
          });
          throw error;
        }
      },

      reset: () => {
        // Clean up audio URL to prevent memory leaks
        const { audioUrl } = get();
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        set(initialState);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'recording-store',
    }
  )
);