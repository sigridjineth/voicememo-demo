import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagInput } from './TagInput';
import { MemoEditorProps } from '@/types';
import { CATEGORIES, DEFAULTS } from '@/lib/constants';

const memoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type MemoFormData = z.infer<typeof memoSchema>;

export function MemoEditor({ memo, onSave, onCancel, isLoading = false }: MemoEditorProps) {
  const [tags, setTags] = useState<string[]>(memo?.tags || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<MemoFormData>({
    resolver: zodResolver(memoSchema),
    defaultValues: {
      title: memo?.title || '',
      content: memo?.content || '',
      category: memo?.category || DEFAULTS.MEMO_CATEGORY,
      tags: memo?.tags || [],
    },
  });

  const category = watch('category');

  useEffect(() => {
    setValue('tags', tags, { shouldDirty: true });
  }, [tags, setValue]);

  const onSubmit = (data: MemoFormData) => {
    onSave({
      ...data,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          placeholder="Enter memo title..."
          {...register('title')}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <Textarea
          id="content"
          placeholder="Enter memo content..."
          rows={10}
          {...register('content')}
          disabled={isLoading}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Select
          value={category}
          onValueChange={(value) => setValue('category', value, { shouldDirty: true })}
          disabled={isLoading}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="Add tags..."
          maxTags={DEFAULTS.MAX_TAGS}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !isDirty}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
}