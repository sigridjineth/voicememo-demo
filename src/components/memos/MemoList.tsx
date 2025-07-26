import { Grid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemoCard } from './MemoCard';
import { MemoListProps } from '@/types';
import { cn } from '@/lib/utils';

export function MemoList({
  memos,
  onMemoSelect,
  onMemoEdit,
  onMemoDelete,
  isLoading = false,
  emptyMessage = 'No memos found',
  viewMode = 'grid',
}: MemoListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (memos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">{emptyMessage}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Start by creating a new memo or recording audio
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'space-y-4'
      )}
    >
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onClick={() => onMemoSelect?.(memo)}
          onEdit={() => onMemoEdit?.(memo)}
          onDelete={() => onMemoDelete?.(memo)}
        />
      ))}
    </div>
  );
}

export function MemoListHeader({
  viewMode,
  onViewModeChange,
  totalCount,
}: {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalCount: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {totalCount} {totalCount === 1 ? 'memo' : 'memos'}
      </p>
      
      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="h-4 w-4" />
          <span className="sr-only">Grid view</span>
        </Button>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">List view</span>
        </Button>
      </div>
    </div>
  );
}