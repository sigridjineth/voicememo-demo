# Clova Note Frontend

AI-powered voice memo application frontend built with React, TypeScript, and Vite.

## Features

- 🎙️ Voice recording with real-time transcription
- 📝 Memo management (CRUD operations)
- 🔍 Smart search with RAG (Retrieval-Augmented Generation)
- 🎯 Tagging and categorization
- 📱 PWA support for offline access
- 🌐 Multi-language support (Korean, English, Japanese, Chinese)

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router v6
- **API Client**: Axios with React Query
- **Audio Processing**: RecordRTC + WaveSurfer.js
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/          # API client and endpoints
├── components/   # Reusable components
│   ├── ui/       # Base UI components (shadcn/ui)
│   ├── audio/    # Audio recording components
│   ├── memos/    # Memo-related components
│   ├── search/   # Search and RAG components
│   └── layout/   # Layout components
├── pages/        # Page components
├── hooks/        # Custom React hooks
├── stores/       # Zustand stores
├── lib/          # Utility functions
├── types/        # TypeScript types
└── styles/       # Global styles
```

## Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws

# Feature Flags
VITE_ENABLE_LIVE_TRANSCRIPTION=true
VITE_ENABLE_OFFLINE_MODE=false

# Audio Settings
VITE_MAX_RECORDING_DURATION=600
VITE_AUDIO_SAMPLE_RATE=16000
```

## Docker

```bash
# Build Docker image
docker build -t clova-note-frontend .

# Run container
docker run -p 80:80 clova-note-frontend
```

## Contributing

Please follow the TDD principles outlined in CLAUDE.md when contributing to this project.

## License

MIT
