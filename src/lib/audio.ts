import { AUDIO_CONFIG } from './constants';

export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return false;
  }
}

export function createAudioContext(): AudioContext {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContextClass();
}

export function visualizeAudio(
  stream: MediaStream,
  canvas: HTMLCanvasElement,
  options?: {
    barWidth?: number;
    barGap?: number;
    barColor?: string;
    backgroundColor?: string;
  }
) {
  const {
    barWidth = 3,
    barGap = 2,
    barColor = '#3b82f6',
    backgroundColor = 'transparent',
  } = options || {};

  const audioContext = createAudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  
  source.connect(analyser);
  analyser.fftSize = 256;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const canvasContext = canvas.getContext('2d')!;
  const width = canvas.width;
  const height = canvas.height;
  
  let animationId: number;
  
  const draw = () => {
    animationId = requestAnimationFrame(draw);
    
    analyser.getByteFrequencyData(dataArray);
    
    canvasContext.fillStyle = backgroundColor;
    canvasContext.fillRect(0, 0, width, height);
    
    const barCount = Math.floor(width / (barWidth + barGap));
    const step = Math.floor(bufferLength / barCount);
    
    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step];
      const barHeight = (value / 255) * height * 0.8;
      const x = i * (barWidth + barGap);
      const y = height - barHeight;
      
      canvasContext.fillStyle = barColor;
      canvasContext.fillRect(x, y, barWidth, barHeight);
    }
  };
  
  draw();
  
  return {
    stop: () => {
      cancelAnimationFrame(animationId);
      source.disconnect();
      audioContext.close();
    },
  };
}

export function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function compressAudio(blob: Blob, targetBitrate: number = 64000): Promise<Blob> {
  // For now, return the original blob
  // In a production app, you'd implement actual compression
  return blob;
}

export function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      reject(new Error('Failed to load audio metadata'));
    };
    
    audio.src = URL.createObjectURL(blob);
  });
}

export function downloadAudio(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}