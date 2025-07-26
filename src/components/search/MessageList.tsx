import { useRef, useEffect } from 'react';
import { User, Bot, FileText, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageListProps } from '@/types';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export function MessageList({ messages, isLoading = false, onSourceClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-3',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              'max-w-[80%] space-y-2',
              message.role === 'user' ? 'items-end' : 'items-start'
            )}
          >
            <Card
              className={cn(
                'p-3',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary'
              )}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </Card>

            {/* Sources for assistant messages */}
            {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Sources:</p>
                <div className="space-y-1">
                  {message.sources.map((source, index) => (
                    <button
                      key={index}
                      onClick={() => onSourceClick?.(source.memoId)}
                      className="flex items-start gap-2 rounded-md bg-secondary/50 p-2 text-left text-xs transition-colors hover:bg-secondary"
                    >
                      <FileText className="mt-0.5 h-3 w-3 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <p className="line-clamp-2">{source.content}</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>Relevance: {Math.round(source.relevance * 100)}%</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(message.timestamp)}
            </p>
          </div>

          {message.role === 'user' && (
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <Card className="bg-secondary p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            </div>
          </Card>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}