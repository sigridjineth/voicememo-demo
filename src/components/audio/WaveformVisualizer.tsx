import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveformVisualizerProps } from '@/types';
import { formatDuration } from '@/lib/formatters';

export function WaveformVisualizer({ 
  audioUrl, 
  isRecording = false,
  audioContext 
}: WaveformVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#3b82f6',
      progressColor: '#1e40af',
      cursorColor: '#1e40af',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 100,
      barGap: 3,
      normalize: true,
      interact: !isRecording,
      ...(audioContext && { audioContext }),
    });

    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on('ready', () => {
      setIsReady(true);
      setDuration(wavesurfer.getDuration());
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('finish', () => setIsPlaying(false));

    // Load audio if URL is provided
    if (audioUrl && !isRecording) {
      wavesurfer.load(audioUrl);
    }

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, isRecording, audioContext]);

  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
  };

  const handleRestart = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.seekTo(0);
    setCurrentTime(0);
  };

  if (isRecording) {
    return (
      <div className="space-y-4">
        <div ref={containerRef} className="w-full" />
        <div className="text-center text-sm text-muted-foreground">
          Live waveform visualization
        </div>
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className="flex h-[100px] items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-sm text-muted-foreground">No audio loaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="w-full" />
      
      {isReady && (
        <>
          {/* Time display */}
          <div className="flex items-center justify-between text-sm">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleRestart}
              disabled={!isReady}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={handlePlayPause}
              disabled={!isReady}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}