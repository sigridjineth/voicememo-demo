import { useState, useRef, useCallback, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { AUDIO_CONFIG, DEFAULTS } from '@/lib/constants';
import { requestMicrophonePermission } from '@/lib/audio';

interface UseAudioRecorderOptions {
  maxDuration?: number;
  autoStart?: boolean;
  onComplete?: (blob: Blob, duration: number) => void;
  onError?: (error: Error) => void;
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const {
    maxDuration = DEFAULTS.MAX_RECORDING_DURATION,
    autoStart = false,
    onComplete,
    onError,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check microphone permission
  useEffect(() => {
    requestMicrophonePermission().then(setHasPermission);
  }, []);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && hasPermission) {
      startRecording();
    }
  }, [autoStart, hasPermission]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [isRecording, audioUrl]);

  const startRecording = useCallback(async () => {
    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setHasPermission(false);
        onError?.(new Error('Microphone permission denied'));
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: AUDIO_CONFIG.sampleRate,
          channelCount: AUDIO_CONFIG.numberOfChannels,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;

      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: AUDIO_CONFIG.mimeType,
        desiredSampRate: AUDIO_CONFIG.sampleRate,
        numberOfAudioChannels: AUDIO_CONFIG.numberOfChannels,
        bufferSize: 4096,
        audioBitsPerSecond: AUDIO_CONFIG.audioBitsPerSecond,
      });

      recorderRef.current.startRecording();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setHasPermission(false);
      onError?.(error as Error);
    }
  }, [maxDuration, onError]);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current && isRecording && !isPaused) {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current && isRecording && isPaused) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
      
      // Resume duration timer
      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
    }
  }, [isRecording, isPaused, maxDuration]);

  const stopRecording = useCallback(() => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current!.getBlob();
      const url = URL.createObjectURL(blob);

      setAudioBlob(blob);
      setAudioUrl(url);
      setIsRecording(false);
      setIsPaused(false);

      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      onComplete?.(blob, duration);
    });
  }, [duration, onComplete]);

  const reset = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  }, [isRecording, audioUrl, stopRecording]);

  return {
    // State
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    hasPermission,
    
    // Actions
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset,
  };
}