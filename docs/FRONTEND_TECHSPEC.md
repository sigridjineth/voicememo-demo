# Frontend Technical Specification - Clova Note

## Overview
This document provides the complete technical specification for the frontend development of Clova Note. This specification is designed for a dedicated Claude Code session focused on frontend implementation that will integrate with the backend API.

## Technology Stack Decision

### Recommended: React with TypeScript
```json
{
  "framework": "React 18+",
  "language": "TypeScript",
  "styling": "Tailwind CSS + shadcn/ui",
  "state": "Zustand",
  "routing": "React Router v6",
  "build": "Vite",
  "testing": "Vitest + React Testing Library"
}
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Root component
│   ├── vite-env.d.ts          # Vite types
│   │
│   ├── api/                    # API integration
│   │   ├── client.ts          # Axios instance & interceptors
│   │   ├── auth.ts            # Auth API calls
│   │   ├── memos.ts           # Memos API calls
│   │   ├── voice.ts           # Voice API calls
│   │   └── rag.ts             # RAG API calls
│   │
│   ├── components/             # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── audio/
│   │   │   ├── AudioRecorder.tsx
│   │   │   ├── WaveformVisualizer.tsx
│   │   │   └── TranscriptionDisplay.tsx
│   │   ├── memos/
│   │   │   ├── MemoCard.tsx
│   │   │   ├── MemoList.tsx
│   │   │   ├── MemoEditor.tsx
│   │   │   └── TagInput.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── RAGChat.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── pages/                  # Page components
│   │   ├── Home.tsx           # Dashboard
│   │   ├── Record.tsx         # Recording interface
│   │   ├── MemoDetail.tsx     # Memo view/edit
│   │   ├── Search.tsx         # Search & RAG interface
│   │   ├── Settings.tsx       # User settings
│   │   ├── Login.tsx          # Auth pages
│   │   └── Register.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAudioRecorder.ts
│   │   ├── useWebSocket.ts    # For real-time features
│   │   ├── useDebounce.ts
│   │   └── useInfiniteScroll.ts
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── authStore.ts       # User & auth state
│   │   ├── memoStore.ts       # Memos state
│   │   ├── recordingStore.ts  # Recording state
│   │   └── searchStore.ts     # Search/RAG state
│   │
│   ├── lib/                    # Utilities
│   │   ├── audio.ts           # Audio processing utils
│   │   ├── formatters.ts      # Date, time formatters
│   │   ├── validators.ts      # Form validation
│   │   └── constants.ts       # App constants
│   │
│   ├── types/                  # TypeScript types
│   │   ├── api.ts             # API response types
│   │   ├── models.ts          # Data models
│   │   └── components.ts      # Component prop types
│   │
│   └── styles/                 # Global styles
│       └── globals.css        # Tailwind imports
│
├── tests/                      # Test files
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

## Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "axios": "^1.7.9",
    "zustand": "^5.0.2",
    "@tanstack/react-query": "^5.62.0",
    "lucide-react": "^0.468.0",
    "date-fns": "^4.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.1",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-toast": "^1.2.3",
    "wavesurfer.js": "^7.8.13",
    "recordrtc": "^5.6.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.14",
    "@types/react-dom": "^18.3.2",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^6.0.0",
    "vitest": "^2.1.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/user-event": "^14.6.0"
  }
}
```

## Environment Configuration

`.env.example`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws

# Feature Flags
VITE_ENABLE_LIVE_TRANSCRIPTION=true
VITE_ENABLE_OFFLINE_MODE=false

# Audio Settings
VITE_MAX_RECORDING_DURATION=600 # 10 minutes in seconds
VITE_AUDIO_SAMPLE_RATE=16000
```

## Key Components Implementation

### 1. Audio Recorder Component

`src/components/audio/AudioRecorder.tsx`:
```typescript
import { useState, useRef, useCallback } from 'react';
import RecordRTC from 'recordrtc';
import { useRecordingStore } from '@/stores/recordingStore';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  maxDuration?: number;
}

export function AudioRecorder({ onRecordingComplete, maxDuration = 600 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  
  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    recorderRef.current = new RecordRTC(stream, {
      type: 'audio',
      mimeType: 'audio/webm',
      desiredSampRate: 16000,
      numberOfAudioChannels: 1,
    });
    
    recorderRef.current.startRecording();
    setIsRecording(true);
  }, []);
  
  // Implementation details...
}
```

### 2. Real-time Transcription Hook

`src/hooks/useRealtimeTranscription.ts`:
```typescript
import { useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

export function useRealtimeTranscription(isRecording: boolean) {
  const ws = useWebSocket('/ws/transcribe');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  useEffect(() => {
    if (!isRecording || !ws.isConnected) return;
    
    // Send audio chunks to WebSocket
    // Receive transcription updates
    
    ws.on('transcription.partial', (data) => {
      setInterimTranscript(data.text);
    });
    
    ws.on('transcription.final', (data) => {
      setTranscript(prev => prev + ' ' + data.text);
      setInterimTranscript('');
    });
  }, [isRecording, ws]);
  
  return { transcript, interimTranscript };
}
```

### 3. Memo Store (Zustand)

`src/stores/memoStore.ts`:
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { api } from '@/api';

interface MemoState {
  memos: Memo[];
  currentMemo: Memo | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMemos: (params?: FetchParams) => Promise<void>;
  createMemo: (data: CreateMemoData) => Promise<Memo>;
  updateMemo: (id: string, data: UpdateMemoData) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  setCurrentMemo: (memo: Memo | null) => void;
}

export const useMemoStore = create<MemoState>()(
  devtools(
    persist(
      (set, get) => ({
        memos: [],
        currentMemo: null,
        isLoading: false,
        error: null,
        
        fetchMemos: async (params) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.memos.list(params);
            set({ memos: response.data, isLoading: false });
          } catch (error) {
            set({ error: error.message, isLoading: false });
          }
        },
        
        // Other actions...
      }),
      {
        name: 'memo-store',
        partialize: (state) => ({ memos: state.memos }),
      }
    )
  )
);
```

### 4. RAG Chat Interface

`src/components/search/RAGChat.tsx`:
```typescript
import { useState } from 'react';
import { useSearchStore } from '@/stores/searchStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { SuggestedQuestions } from './SuggestedQuestions';

export function RAGChat() {
  const { messages, sendQuery, isLoading } = useSearchStore();
  const [input, setInput] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await sendQuery(input);
    setInput('');
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      
      <div className="border-t p-4">
        <SuggestedQuestions onSelect={setInput} />
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
```

## UI/UX Requirements

### 1. Design System
- Use shadcn/ui components for consistency
- Color scheme: Professional with accent colors
- Typography: Clear hierarchy with Korean font support
- Responsive design: Mobile-first approach

### 2. Key Screens

#### Dashboard (Home)
- Recent memos grid/list view toggle
- Quick record button (floating action button)
- Search bar prominently displayed
- Stats overview (total memos, recording time)

#### Recording Interface
- Large record button with visual feedback
- Real-time waveform visualization
- Live transcription display
- Pause/resume controls
- Recording timer

#### Memo Detail View
- Editable title and content
- Audio player with playback controls
- Tag management
- Timestamps and metadata
- Share/export options

#### Search & RAG Interface
- Search input with filters
- Results with highlighting
- Chat-like interface for RAG queries
- Source citations in responses

### 3. Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG AA)

## State Management Patterns

### 1. Authentication Flow
```typescript
// Check auth on app load
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (token) {
    authStore.validateToken();
  }
}, []);

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

### 2. Optimistic Updates
```typescript
// Example: Update memo optimistically
const updateMemo = async (id: string, data: UpdateMemoData) => {
  // Optimistic update
  set((state) => ({
    memos: state.memos.map(m => 
      m.id === id ? { ...m, ...data } : m
    )
  }));
  
  try {
    await api.memos.update(id, data);
  } catch (error) {
    // Revert on error
    await get().fetchMemos();
    throw error;
  }
};
```

### 3. Infinite Scrolling
```typescript
// Memos list with infinite scroll
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['memos'],
  queryFn: ({ pageParam = 0 }) => api.memos.list({ skip: pageParam }),
  getNextPageParam: (lastPage, pages) => {
    return lastPage.hasMore ? pages.length * 20 : undefined;
  },
});
```

## Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load pages
const Record = lazy(() => import('./pages/Record'));
const Search = lazy(() => import('./pages/Search'));
const Settings = lazy(() => import('./pages/Settings'));
```

### 2. Audio Processing
- Use Web Workers for audio processing
- Chunk large audio files for upload
- Client-side audio compression before upload

### 3. Caching Strategy
- React Query for server state caching
- IndexedDB for offline audio storage
- Service Worker for PWA capabilities

## Testing Strategy

### 1. Unit Tests
```typescript
// Example: AudioRecorder test
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioRecorder } from '@/components/audio/AudioRecorder';

describe('AudioRecorder', () => {
  it('should start recording when button clicked', async () => {
    const onComplete = vi.fn();
    render(<AudioRecorder onRecordingComplete={onComplete} />);
    
    const recordButton = screen.getByRole('button', { name: /start recording/i });
    fireEvent.click(recordButton);
    
    expect(screen.getByText(/recording/i)).toBeInTheDocument();
  });
});
```

### 2. Integration Tests
- Test API integration with MSW (Mock Service Worker)
- Test complete user flows (record → transcribe → save)
- Test real-time features with WebSocket mocks

## Build & Deployment

### 1. Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### 2. Production Build
```bash
# Build commands
npm run build        # Production build
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run test         # Run tests
```

### 3. Docker Configuration
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

## PWA Configuration

`vite.config.ts` additions:
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Clova Note',
        short_name: 'Clova Note',
        theme_color: '#1e293b',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
        ],
      },
    }),
  ],
});
```

## Development Workflow

### 1. Initial Setup
```bash
# Clone and install
git clone <repo>
cd frontend
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development
npm run dev
```

### 2. Component Development Flow
1. Create component with TypeScript interface
2. Add Storybook story for isolated development
3. Write unit tests
4. Integrate into pages
5. Test with API integration

### 3. Git Workflow
```bash
# Feature branch
git checkout -b feature/audio-recorder

# Commit with conventional commits
git commit -m "feat: add audio recorder component"
git commit -m "test: add tests for audio recorder"
git commit -m "docs: update README with audio setup"
```

## Success Criteria

1. Lighthouse score >90 for Performance
2. Core Web Vitals in green zone
3. Full offline capability for viewing memos
4. <3s initial load time
5. Smooth 60fps animations
6. Zero accessibility violations
7. 80%+ test coverage