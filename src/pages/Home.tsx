import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Clock, Mic, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MemoList, MemoListHeader } from '@/components/memos';
import { useMemoStore } from '@/stores';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '@/lib/formatters';

export function Home() {
  const navigate = useNavigate();
  const { memos, fetchMemos, isLoading, total } = useMemoStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const handleMemoSelect = (memo: any) => {
    navigate(`/memo/${memo.id}`);
  };

  const handleMemoEdit = (memo: any) => {
    navigate(`/memo/${memo.id}/edit`);
  };

  const handleMemoDelete = async (memo: any) => {
    if (confirm('Are you sure you want to delete this memo?')) {
      const { deleteMemo } = useMemoStore.getState();
      await deleteMemo(memo.id);
    }
  };

  // Calculate stats
  const totalDuration = memos.reduce((sum, memo) => sum + (memo.duration || 0), 0);
  const todayMemos = memos.filter(
    (memo) => new Date(memo.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const totalTags = new Set(memos.flatMap((memo) => memo.tags)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your memos.
          </p>
        </div>
        <Button onClick={() => navigate('/record')} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          New Memo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Memos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
              {todayMemos} created today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
            <p className="text-xs text-muted-foreground">Audio recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audio Memos</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memos.filter((m) => m.audioUrl).length}
            </div>
            <p className="text-xs text-muted-foreground">With recordings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTags}</div>
            <p className="text-xs text-muted-foreground">Across all memos</p>
          </CardContent>
        </Card>
      </div>

      {/* Memos List */}
      <div className="space-y-4">
        <MemoListHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={total}
        />
        
        <MemoList
          memos={memos}
          onMemoSelect={handleMemoSelect}
          onMemoEdit={handleMemoEdit}
          onMemoDelete={handleMemoDelete}
          isLoading={isLoading}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}