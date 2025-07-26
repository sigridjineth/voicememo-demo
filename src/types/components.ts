import { ReactNode } from 'react';
import { Memo, Message } from './models';

export interface LayoutProps {
  children: ReactNode;
}

export interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  maxDuration?: number;
  onTranscriptionUpdate?: (text: string, isFinal: boolean) => void;
}

export interface WaveformVisualizerProps {
  audioUrl?: string;
  isRecording?: boolean;
  audioContext?: AudioContext;
}

export interface TranscriptionDisplayProps {
  text: string;
  interimText?: string;
  isLoading?: boolean;
}

export interface MemoCardProps {
  memo: Memo;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
}

export interface MemoListProps {
  memos: Memo[];
  onMemoSelect?: (memo: Memo) => void;
  onMemoEdit?: (memo: Memo) => void;
  onMemoDelete?: (memo: Memo) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  viewMode?: 'grid' | 'list';
}

export interface MemoEditorProps {
  memo?: Memo;
  onSave: (data: Partial<Memo>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxTags?: number;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  showFilters?: boolean;
  onFilterChange?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResultsProps {
  results: Array<{
    memo: Memo;
    score: number;
    highlights: string[];
  }>;
  isLoading?: boolean;
  onResultClick?: (memo: Memo) => void;
}

export interface RAGChatProps {
  initialQuery?: string;
  onQuerySubmit?: (query: string) => void;
  conversationId?: string;
}

export interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onSourceClick?: (memoId: string) => void;
}

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export interface HeaderProps {
  user?: {
    name: string;
    email: string;
  };
  onMenuClick?: () => void;
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  categories?: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}