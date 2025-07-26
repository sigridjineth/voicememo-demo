import { FileText, Calendar, Tag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResultsProps } from '@/types';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export function SearchResults({
  results,
  isLoading = false,
  onResultClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">No results found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search query or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card
          key={result.memo.id}
          className="cursor-pointer transition-all hover:shadow-md"
          onClick={() => onResultClick?.(result.memo)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="line-clamp-1 text-lg">
                  {result.memo.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatRelativeTime(result.memo.createdAt)}
                  </span>
                  {result.score > 0 && (
                    <span className="flex items-center gap-1 text-primary">
                      <TrendingUp className="h-3 w-3" />
                      {Math.round(result.score * 100)}% match
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Highlighted content */}
            <div className="space-y-2">
              {result.highlights.length > 0 ? (
                result.highlights.map((highlight, index) => (
                  <p
                    key={index}
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: highlight.replace(
                        /<mark>(.*?)<\/mark>/g,
                        '<mark class="bg-yellow-200 dark:bg-yellow-900">$1</mark>'
                      ),
                    }}
                  />
                ))
              ) : (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {result.memo.content}
                </p>
              )}
            </div>

            {/* Tags and category */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {result.memo.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
                {result.memo.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{result.memo.tags.length - 3}
                  </Badge>
                )}
              </div>

              {result.memo.category && (
                <Badge variant="outline" className="text-xs">
                  {result.memo.category}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}