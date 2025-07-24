# Backend Technical Specification - Clova Note

## Overview
This document provides the complete technical specification for the backend development of Clova Note using Vertex AI Studio's RAG Engine. This specification is designed for a dedicated Claude Code session focused on backend implementation.

## Prerequisites

### 1. Google Cloud Setup
```bash
# Required Google Cloud services to enable:
- Vertex AI API
- Cloud Speech-to-Text API
- Cloud Storage API
- Cloud SQL Admin API
- Cloud Run API
- Secret Manager API

# Install Google Cloud SDK
# Set up authentication:
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Environment Variables
Create `.env` file in backend directory:
```env
# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Database
DATABASE_URL=postgresql://user:password@localhost/clovernote
REDIS_URL=redis://localhost:6379

# Storage
GCS_BUCKET_NAME=clovernote-audio-files

# Vertex AI
VERTEX_AI_LOCATION=us-central1
EMBEDDING_MODEL=textembedding-gecko@003
GEMINI_MODEL=gemini-1.5-flash

# API Configuration
API_V1_PREFIX=/api/v1
BACKEND_CORS_ORIGINS=["http://localhost:3000"]

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Core Dependencies

Add to `pyproject.toml`:
```toml
[project]
dependencies = [
    # Existing dependencies...
    # Google Cloud
    "google-cloud-aiplatform>=1.70.0",
    "google-cloud-speech>=2.28.0",
    "google-cloud-storage>=2.18.0",
    "google-cloud-secret-manager>=2.21.0",
    
    # Database
    "sqlalchemy>=2.0.36",
    "asyncpg>=0.30.0",
    "alembic>=1.14.0",
    "redis>=5.2.0",
    
    # API & Auth
    "python-multipart>=0.0.17",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "pydantic-settings>=2.6.1",
    
    # Utilities
    "httpx>=0.28.0",
    "numpy>=1.26.4",
    "pytest>=8.3.0",
    "pytest-asyncio>=0.25.0",
]
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Settings and configuration
│   ├── dependencies.py         # Dependency injection setup
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py            # API dependencies (auth, db)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py      # Main API router
│   │       ├── auth.py        # Authentication endpoints
│   │       ├── voice.py       # Voice/audio endpoints
│   │       ├── memos.py       # Memo CRUD endpoints
│   │       └── rag.py         # RAG search endpoints
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py        # JWT, password hashing
│   │   ├── vertex_ai.py       # Vertex AI client wrapper
│   │   ├── storage.py         # GCS operations
│   │   └── exceptions.py      # Custom exceptions
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py           # SQLAlchemy base
│   │   ├── user.py           # User model
│   │   ├── memo.py           # Memo model
│   │   └── embedding.py      # Embedding metadata model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py           # User Pydantic schemas
│   │   ├── memo.py           # Memo Pydantic schemas
│   │   ├── voice.py          # Voice/audio schemas
│   │   └── rag.py            # RAG query/response schemas
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py           # Authentication service
│   │   ├── speech.py         # Speech-to-text service
│   │   ├── embedding.py      # Text embedding service
│   │   ├── vector_search.py  # Vector search service
│   │   └── rag.py            # RAG orchestration service
│   │
│   └── db/
│       ├── __init__.py
│       ├── session.py        # Database session management
│       └── init_db.py        # Database initialization
│
├── alembic/                  # Database migrations
├── tests/                    # Test files
├── scripts/                  # Utility scripts
└── Makefile                  # Development commands
```

## API Endpoints Implementation

### 1. Authentication Module (`app/api/v1/auth.py`)
```python
# Endpoints to implement:
POST   /api/v1/auth/register    # User registration
POST   /api/v1/auth/login       # User login (returns JWT)
POST   /api/v1/auth/refresh     # Refresh access token
GET    /api/v1/auth/me          # Get current user info
PUT    /api/v1/auth/me          # Update user profile
```

### 2. Voice Module (`app/api/v1/voice.py`)
```python
# Endpoints to implement:
POST   /api/v1/voice/upload     # Upload audio file
       # Request: multipart/form-data with audio file
       # Response: {"upload_id": "...", "file_url": "..."}

POST   /api/v1/voice/transcribe # Convert audio to text
       # Request: {"upload_id": "..."} or {"file_url": "..."}
       # Response: {"text": "...", "confidence": 0.95, "duration": 120}

GET    /api/v1/voice/{voice_id} # Get audio file info/download URL
DELETE /api/v1/voice/{voice_id} # Delete audio file
```

### 3. Memos Module (`app/api/v1/memos.py`)
```python
# Endpoints to implement:
POST   /api/v1/memos            # Create new memo
       # Request: {"title": "...", "content": "...", "audio_id": "...", "tags": [...]}
       # Response: Memo object with embedding_id

GET    /api/v1/memos            # List user's memos
       # Query params: ?skip=0&limit=20&category=...&tags=...

GET    /api/v1/memos/{memo_id}  # Get specific memo
PUT    /api/v1/memos/{memo_id}  # Update memo (triggers re-embedding)
DELETE /api/v1/memos/{memo_id}  # Delete memo (and its embeddings)

POST   /api/v1/memos/{memo_id}/generate-title  # Auto-generate title using Gemini
```

### 4. RAG Module (`app/api/v1/rag.py`)
```python
# Endpoints to implement:
POST   /api/v1/rag/search       # Vector similarity search
       # Request: {"query": "...", "limit": 10, "filters": {...}}
       # Response: {"results": [...], "total": 42}

POST   /api/v1/rag/query        # RAG-based Q&A
       # Request: {"question": "...", "context_limit": 5}
       # Response: {"answer": "...", "sources": [...], "confidence": 0.9}

GET    /api/v1/rag/suggestions  # Get suggested questions
       # Query params: ?memo_id=...&limit=5
```

## Core Services Implementation

### 1. Vertex AI Service (`app/core/vertex_ai.py`)
```python
from google.cloud import aiplatform
from vertexai.language_models import TextEmbeddingModel
from vertexai.generative_models import GenerativeModel

class VertexAIClient:
    def __init__(self, project_id: str, location: str):
        aiplatform.init(project=project_id, location=location)
        self.embedding_model = TextEmbeddingModel.from_pretrained("textembedding-gecko@003")
        self.gemini_model = GenerativeModel("gemini-1.5-flash")
        
    async def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for text list"""
        
    async def generate_text(self, prompt: str, context: str = "") -> str:
        """Generate text using Gemini"""
```

### 2. Speech Service (`app/services/speech.py`)
```python
from google.cloud import speech_v1

class SpeechToTextService:
    def __init__(self):
        self.client = speech_v1.SpeechClient()
        
    async def transcribe_audio(self, audio_uri: str, language_code: str = "ko-KR") -> dict:
        """Transcribe audio file from GCS"""
        config = speech_v1.RecognitionConfig(
            encoding=speech_v1.RecognitionConfig.AudioEncoding.MP3,
            sample_rate_hertz=16000,
            language_code=language_code,
            enable_automatic_punctuation=True,
            model="latest_long"
        )
        # Implementation details...
```

### 3. Vector Search Service (`app/services/vector_search.py`)
```python
class VectorSearchService:
    def __init__(self, index_endpoint_name: str):
        self.index_endpoint = self._get_or_create_index_endpoint(index_endpoint_name)
        
    async def upsert_embeddings(self, embeddings: List[dict]):
        """Add or update embeddings in vector index"""
        
    async def search_similar(self, query_embedding: List[float], top_k: int = 10) -> List[dict]:
        """Search for similar vectors"""
        
    async def delete_embeddings(self, embedding_ids: List[str]):
        """Remove embeddings from index"""
```

## Database Models

### 1. User Model (`app/models/user.py`)
```python
from sqlalchemy import Column, String, DateTime, JSON, Boolean
from app.models.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)  # UUID
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, default=lambda: {
        "language": "ko-KR",
        "auto_transcribe": True,
        "default_category": "general"
    })
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
```

### 2. Memo Model (`app/models/memo.py`)
```python
class Memo(Base):
    __tablename__ = "memos"
    
    id = Column(String, primary_key=True)  # UUID
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    audio_url = Column(String)
    tags = Column(ARRAY(String), default=list)
    category = Column(String, default="general")
    duration = Column(Integer)  # seconds
    embedding_id = Column(String, unique=True)  # Vector search reference
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="memos")
```

## Testing Strategy

### 1. Unit Tests Structure
```
tests/
├── conftest.py              # Pytest fixtures
├── test_api/
│   ├── test_auth.py
│   ├── test_voice.py
│   ├── test_memos.py
│   └── test_rag.py
├── test_services/
│   ├── test_speech.py
│   ├── test_embedding.py
│   └── test_vector_search.py
└── test_core/
    ├── test_security.py
    └── test_vertex_ai.py
```

### 2. Test Fixtures (`tests/conftest.py`)
```python
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.fixture
async def client(app) -> AsyncClient:
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def authenticated_client(client, test_user) -> AsyncClient:
    # Add auth headers to client
    pass

@pytest.fixture
async def mock_vertex_ai(monkeypatch):
    # Mock Vertex AI calls
    pass
```

## Development Workflow

### 1. Initial Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -e .
pip install -r requirements-dev.txt

# Setup database
alembic upgrade head

# Run tests
pytest

# Start development server
uvicorn app.main:app --reload --port 8000
```

### 2. Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Add memo table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### 3. Makefile Commands
```makefile
.PHONY: format check test run migrate

format:
	black app tests
	isort app tests

check:
	black --check app tests
	isort --check app tests
	flake8 app tests
	mypy app

test:
	pytest -v

run:
	uvicorn app.main:app --reload --port 8000

migrate:
	alembic upgrade head
```

## Security Considerations

1. **Authentication**: JWT-based with refresh tokens
2. **Data Isolation**: User data strictly separated via user_id
3. **Input Validation**: Pydantic schemas for all inputs
4. **File Upload**: Validate file types, size limits
5. **API Rate Limiting**: Implement per-user limits
6. **Secrets Management**: Use Google Secret Manager

## Performance Optimization

1. **Caching**: Redis for frequently accessed data
2. **Async Operations**: All I/O operations should be async
3. **Batch Processing**: Batch embedding generation
4. **Connection Pooling**: Database and Redis pools
5. **Background Tasks**: Use Celery/Cloud Tasks for long operations

## Monitoring & Logging

1. **Structured Logging**: Use `structlog`
2. **Request Tracing**: Implement request ID tracking
3. **Metrics**: Prometheus metrics for API performance
4. **Error Tracking**: Sentry integration
5. **Health Checks**: `/health` and `/ready` endpoints

## Deployment Configuration

### Cloud Run Deployment
```yaml
# cloud-run.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: clovernote-backend
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 100
      timeoutSeconds: 300
      serviceAccountName: clovernote-backend@PROJECT_ID.iam.gserviceaccount.com
      containers:
      - image: gcr.io/PROJECT_ID/clovernote-backend
        ports:
        - containerPort: 8000
        env:
        - name: GOOGLE_CLOUD_PROJECT
          value: PROJECT_ID
        resources:
          limits:
            cpu: "2"
            memory: "2Gi"
```

## Success Criteria

1. All tests passing (>90% coverage)
2. API response time <500ms for most endpoints
3. Speech-to-text accuracy >95%
4. Vector search relevance score >0.8
5. Successful deployment to Cloud Run