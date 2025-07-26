import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioRecorder, TranscriptionDisplay } from '@/components/audio';
import { MemoEditor } from '@/components/memos';
import { useRecordingStore, useMemoStore } from '@/stores';
import { useNavigate } from 'react-router-dom';
import { CreateMemoData } from '@/types';

export function Record() {
  const navigate = useNavigate();
  const {
    audioBlob,
    transcription,
    duration,
    isTranscribing,
    transcribeAudio,
    uploadAudio,
    reset: resetRecording,
  } = useRecordingStore();
  const { createMemo } = useMemoStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    // Automatically transcribe the audio
    try {
      await transcribeAudio(blob);
    } catch (error) {
      console.error('Transcription failed:', error);
    }
  };

  const handleSave = async (memoData: Partial<CreateMemoData>) => {
    if (!memoData.content) return;

    setIsSaving(true);
    try {
      let audioUrl: string | undefined;
      
      // Upload audio if available
      if (audioBlob) {
        const { url } = await uploadAudio(audioBlob);
        audioUrl = url;
      }

      // Create memo
      const newMemo = await createMemo({
        ...memoData,
        content: memoData.content,
        audioUrl,
        duration,
      } as CreateMemoData);

      // Reset recording state
      resetRecording();
      
      // Navigate to the new memo
      navigate(`/memo/${newMemo.id}`);
    } catch (error) {
      console.error('Failed to save memo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to discard this recording?')) {
      resetRecording();
      navigate('/');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Record Memo</h1>
          <p className="text-muted-foreground">
            Record your voice memo and it will be automatically transcribed
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      {/* Recording Card */}
      <Card>
        <CardHeader>
          <CardTitle>Audio Recording</CardTitle>
          <CardDescription>
            Click the microphone button to start recording
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onTranscriptionUpdate={(text, isFinal) => {
              // Handle real-time transcription updates if implemented
              console.log('Transcription update:', { text, isFinal });
            }}
          />
        </CardContent>
      </Card>

      {/* Transcription Display */}
      {(transcription || isTranscribing) && (
        <Card>
          <CardHeader>
            <CardTitle>Transcription</CardTitle>
            <CardDescription>
              Automatically transcribed from your audio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptionDisplay
              text={transcription}
              isLoading={isTranscribing}
            />
          </CardContent>
        </Card>
      )}

      {/* Memo Editor */}
      {transcription && !isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Create Memo</CardTitle>
            <CardDescription>
              Review and edit your transcribed memo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted p-4">
                <p className="whitespace-pre-wrap">{transcription}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)}>
                  Edit & Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSave({
                      title: `Recording from ${new Date().toLocaleDateString()}`,
                      content: transcription,
                    })
                  }
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Quick Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Memo</CardTitle>
            <CardDescription>
              Add a title, tags, and make any edits to your memo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MemoEditor
              memo={{
                title: `Recording from ${new Date().toLocaleDateString()}`,
                content: transcription,
              } as any}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              isLoading={isSaving}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}