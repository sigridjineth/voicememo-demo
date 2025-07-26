import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SuggestedQuestionsProps } from '@/types';

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>Suggested questions:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(question)}
            className="h-auto whitespace-normal px-3 py-2 text-left text-xs"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}