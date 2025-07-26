import { Mic, Calendar, Clock, MoreVertical, Edit, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemoCardProps } from '@/types';
import { formatRelativeTime, formatDuration, truncateText } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export function MemoCard({ 
  memo, 
  onClick, 
  onEdit, 
  onDelete, 
  isSelected = false 
}: MemoCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on actions
    if ((e.target as HTMLElement).closest('[data-no-click]')) {
      return;
    }
    onClick?.();
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="line-clamp-1 text-lg">
              {memo.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRelativeTime(memo.createdAt)}
              </span>
              {memo.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(memo.duration)}
                </span>
              )}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-no-click>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.()}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {truncateText(memo.content, 150)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {memo.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {memo.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{memo.tags.length - 3}
              </Badge>
            )}
          </div>

          {memo.audioUrl && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Mic className="mr-1 h-3 w-3" />
              Audio
            </div>
          )}
        </div>

        {memo.category && (
          <Badge variant="outline" className="text-xs">
            {memo.category}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}