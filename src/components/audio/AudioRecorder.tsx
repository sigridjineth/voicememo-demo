import { useState, useRef, useCallback, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { Mic, MicOff, Pause, Play, Square, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecordingStore } from '@/stores';
import { AudioRecorderProps } from '@/types';
import { AUDIO_CONFIG, DEFAULTS } from '@/lib/constants';
import { formatDuration } from '@/lib/formatters';
import { requestMicrophonePermission, visualizeAudio, downloadAudio } from '@/lib/audio';
import { cn } from '@/lib/utils';

export function AudioRecorder({ 
  onRecordingComplete, 
  maxDuration = DEFAULTS.MAX_RECORDING_DURATION,
  onTranscriptionUpdate 
}: AudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    startRecording: startRecordingStore,
    pauseRecording: pauseRecordingStore,
    resumeRecording: resumeRecordingStore,
    stopRecording: stopRecordingStore,
    updateDuration,
    reset,
  } = useRecordingStore();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<{ stop: () => void } | null>(null);

  // Request microphone permission on mount
  useEffect(() => {
    requestMicrophonePermission().then(setHasPermission);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      reset();
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setHasPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: AUDIO_CONFIG.sampleRate,
          channelCount: AUDIO_CONFIG.numberOfChannels,
          echoCancellation: true,
          noiseSuppression: true,
        } 
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
      startRecordingStore();

      // Start duration timer
      intervalRef.current = setInterval(() => {
        updateDuration(recorderRef.current?.getState() === 'recording' ? duration + 1 : duration);
      }, 1000);

      // Start visualization
      if (canvasRef.current) {
        visualizerRef.current = visualizeAudio(stream, canvasRef.current);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      setHasPermission(false);
    }
  }, [startRecordingStore, updateDuration, duration]);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.pauseRecording();
      pauseRecordingStore();
    }
  }, [isRecording, pauseRecordingStore]);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current && isPaused) {
      recorderRef.current.resumeRecording();
      resumeRecordingStore();
    }
  }, [isPaused, resumeRecordingStore]);

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current) return;

    setIsProcessing(true);

    recorderRef.current.stopRecording(async () => {
      const blob = recorderRef.current!.getBlob();
      
      // Clean up
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (visualizerRef.current) {
        visualizerRef.current.stop();
        visualizerRef.current = null;
      }

      stopRecordingStore(blob, duration);
      setIsProcessing(false);

      if (onRecordingComplete) {
        onRecordingComplete(blob, duration);
      }
    });
  }, [duration, stopRecordingStore, onRecordingComplete]);

  const handleDownload = () => {
    if (audioBlob) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadAudio(audioBlob, `recording-${timestamp}.webm`);
    }
  };

  // Auto-stop when max duration is reached
  useEffect(() => {
    if (isRecording && duration >= maxDuration) {
      stopRecording();
    }
  }, [duration, maxDuration, isRecording, stopRecording]);

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <MicOff className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Microphone permission is required to record audio.
        </p>
        <Button onClick={() => requestMicrophonePermission().then(setHasPermission)}>
          Grant Permission
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Visualizer */}
      <div className="relative h-32 w-full overflow-hidden rounded-lg bg-secondary/20">
        <canvas
          ref={canvasRef}
          width={800}
          height={128}
          className="h-full w-full"
        />
        {!isRecording && !audioUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Click record to start
            </p>
          </div>
        )}
      </div>

      {/* Duration display */}
      <div className="text-center">
        <p className="text-3xl font-mono font-bold">
          {formatDuration(duration)}
        </p>
        <p className="text-sm text-muted-foreground">
          Max duration: {formatDuration(maxDuration)}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRecording && !audioUrl && (
          <Button
            size="lg"
            onClick={startRecording}
            disabled={isProcessing}
            className="h-16 w-16 rounded-full"
          >
            <Mic className="h-6 w-6" />
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              size="lg"
              variant="secondary"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="h-12 w-12 rounded-full"
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={stopRecording}
              disabled={isProcessing}
              className="h-16 w-16 rounded-full"
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}

        {audioUrl && !isRecording && (
          <>
            <Button
              size="lg"
              onClick={() => {
                reset();
                startRecording();
              }}
              disabled={isProcessing}
              className="h-16 w-16 rounded-full"
            >
              <Mic className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDownload}
              className="h-12 w-12 rounded-full"
            >
              <Download className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-3 w-3 rounded-full",
          isRecording && !isPaused ? "bg-red-500 animate-pulse" : "bg-gray-300"
        )} />
        <span className="text-sm font-medium">
          {isProcessing ? "Processing..." : 
           isRecording ? (isPaused ? "Paused" : "Recording") : 
           audioUrl ? "Recording complete" : "Ready"}
        </span>
      </div>

      {/* Audio preview */}
      {audioUrl && !isRecording && (
        <audio controls className="w-full max-w-md">
          <source src={audioUrl} type={AUDIO_CONFIG.mimeType} />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}