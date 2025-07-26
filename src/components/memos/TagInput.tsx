import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TagInputProps } from '@/types';

export function TagInput({
  value,
  onChange,
  placeholder = 'Add a tag...',
  suggestions = [],
  maxTags = 5,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-background p-2">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 rounded-full outline-none hover:bg-secondary"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {value.length < maxTags && (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="h-7 flex-1 border-0 bg-transparent px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ minWidth: '120px' }}
          />
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
        <div className="rounded-md border bg-popover p-1 shadow-md">
          {filteredSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="block w-full rounded-sm px-2 py-1 text-left text-sm hover:bg-accent"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {value.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
}