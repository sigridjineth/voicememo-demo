import { Loader2 } from 'lucide-react';
import { TranscriptionDisplayProps } from '@/types';
import { cn } from '@/lib/utils';

export function TranscriptionDisplay({ 
  text, 
  interimText, 
  isLoading = false 
}: TranscriptionDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">
          Transcribing audio...
        </span>
      </div>
    );
  }

  if (!text && !interimText) {
    return (
      <div className="rounded-lg border-2 border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Transcription will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold">Transcription</h3>
        <div className="prose prose-sm max-w-none">
          <p className={cn("whitespace-pre-wrap", !text && "text-muted-foreground")}>
            {text || "Start speaking..."}
            {interimText && (
              <span className="text-muted-foreground italic"> {interimText}</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      {text && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border bg-secondary/20 p-3">
            <p className="text-muted-foreground">Words</p>
            <p className="text-2xl font-semibold">
              {text.split(/\s+/).filter(Boolean).length}
            </p>
          </div>
          <div className="rounded-lg border bg-secondary/20 p-3">
            <p className="text-muted-foreground">Characters</p>
            <p className="text-2xl font-semibold">{text.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}