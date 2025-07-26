import { useState, useEffect } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { RAGChatProps } from '@/types';
import { useSearchStore } from '@/stores';
import { useNavigate } from 'react-router-dom';

export function RAGChat({ 
  initialQuery = '', 
  onQuerySubmit,
  conversationId 
}: RAGChatProps) {
  const navigate = useNavigate();
  const {
    messages,
    isQuerying,
    ragError,
    suggestedQuestions,
    sendQuery,
    clearConversation,
    loadConversation,
    getSuggestions,
  } = useSearchStore();

  const [input, setInput] = useState(initialQuery);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else if (messages.length === 0) {
      // Get initial suggestions
      getSuggestions();
    }
  }, [conversationId]);

  const handleSubmit = async (query: string) => {
    await sendQuery(query);
    setInput('');
    onQuerySubmit?.(query);
  };

  const handleSourceClick = (memoId: string) => {
    navigate(`/memo/${memoId}`);
  };

  const handleNewConversation = () => {
    clearConversation();
    setInput('');
    getSuggestions();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewConversation}
          disabled={isQuerying || messages.length === 0}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div className="space-y-4">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Ask me anything about your memos</h3>
                <p className="text-sm text-muted-foreground">
                  I can help you find information, summarize content, and answer questions
                  based on your saved memos.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            isLoading={isQuerying}
            onSourceClick={handleSourceClick}
          />
        )}
      </div>

      {/* Input area */}
      <div className="border-t p-4 space-y-4">
        {ragError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {ragError}
          </div>
        )}

        {messages.length === 0 && suggestedQuestions.length > 0 && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={handleSubmit}
          />
        )}

        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isQuerying}
        />

        {messages.length > 0 && suggestedQuestions.length > 0 && (
          <div className="border-t pt-4">
            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelect={setInput}
            />
          </div>
        )}
      </div>
    </div>
  );
}