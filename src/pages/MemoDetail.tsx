import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaveformVisualizer } from '@/components/audio';
import { MemoEditor } from '@/components/memos';
import { useMemoStore } from '@/stores';
import { formatDate, formatDuration } from '@/lib/formatters';
import { downloadAudio } from '@/lib/audio';

export function MemoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentMemo, getMemo, updateMemo, deleteMemo, isLoading } = useMemoStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      getMemo(id);
    }
  }, [id, getMemo]);

  const handleEdit = async (data: any) => {
    if (!id) return;
    
    await updateMemo(id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this memo?')) {
      await deleteMemo(id);
      navigate('/');
    }
  };

  const handleDownloadAudio = () => {
    if (currentMemo?.audioUrl) {
      // In a real app, this would download from the actual URL
      console.log('Downloading audio from:', currentMemo.audioUrl);
    }
  };

  const handleExport = () => {
    if (!currentMemo) return;
    
    const content = `# ${currentMemo.title}\n\n${currentMemo.content}\n\n---\nCreated: ${formatDate(currentMemo.createdAt, 'LONG')}\nTags: ${currentMemo.tags.join(', ')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentMemo.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !currentMemo) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Loading memo...</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Memo</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <MemoEditor
              memo={currentMemo}
              onSave={handleEdit}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{currentMemo.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(currentMemo.createdAt, 'LONG')}
              </span>
              {currentMemo.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(currentMemo.duration)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Audio Player */}
      {currentMemo.audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Audio Recording</CardTitle>
            <CardDescription>
              Original audio recording of this memo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <WaveformVisualizer audioUrl={currentMemo.audioUrl} />
            <Button
              variant="outline"
              onClick={handleDownloadAudio}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Audio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          {currentMemo.category && (
            <Badge variant="outline">{currentMemo.category}</Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{currentMemo.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {currentMemo.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentMemo.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Created</dt>
              <dd>{formatDate(currentMemo.createdAt, 'WITH_TIME')}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Last Updated</dt>
              <dd>{formatDate(currentMemo.updatedAt, 'WITH_TIME')}</dd>
            </div>
            {currentMemo.duration && (
              <div>
                <dt className="font-medium text-muted-foreground">Duration</dt>
                <dd>{formatDuration(currentMemo.duration)}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-muted-foreground">Word Count</dt>
              <dd>{currentMemo.content.split(/\s+/).filter(Boolean).length} words</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}