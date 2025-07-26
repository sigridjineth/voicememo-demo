import { FormEvent, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageInputProps } from '@/types';

export function MessageInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = 'Ask a question about your memos...',
}: MessageInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={3}
        className="resize-none pr-12"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!value.trim() || isLoading}
        className="absolute bottom-2 right-2"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}