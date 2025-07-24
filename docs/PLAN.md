# Voice Memo Web App - Technical Specification

## 프로젝트 개요
Google Vertex AI Studio의 다양한 기능을 활용하여 음성 메모를 입력하고, 저장된 메모를 RAG(Retrieval-Augmented Generation)로 검색 및 활용할 수 있는 웹 애플리케이션 개발

### 주요 기능
1. 음성 녹음 및 텍스트 변환 (Speech-to-Text)
2. 메모 저장 및 관리
3. 벡터 임베딩을 통한 의미 기반 검색
4. RAG를 활용한 지능형 메모 검색 및 요약
5. 사용자 친화적인 웹 인터페이스

## 기술 스택

### Backend
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Database**: 
  - PostgreSQL (메타데이터 저장)
  - Vertex AI Vector Search (벡터 임베딩 저장)
- **AI/ML Services** (Vertex AI Studio):
  - Speech-to-Text API
  - Text Embeddings API (textembedding-gecko)
  - Vertex AI Search
  - Gemini Pro (RAG 응답 생성)

### Frontend
- **Framework**: React.js 또는 Vue.js
- **UI Library**: Material-UI 또는 Vuetify
- **Audio Recording**: Web Audio API
- **State Management**: Redux/Vuex

### Infrastructure
- **Hosting**: Google Cloud Run
- **Storage**: Google Cloud Storage (음성 파일)
- **Authentication**: Firebase Auth 또는 Google Identity Platform

## 시스템 아키텍처

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Frontend  │────▶│   FastAPI       │────▶│  Vertex AI      │
│   (React/Vue)   │     │   Backend       │     │  Services       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                          │
                               ▼                          ▼
                        ┌─────────────┐           ┌─────────────┐
                        │ PostgreSQL  │           │ Vector      │
                        │ Database    │           │ Search      │
                        └─────────────┘           └─────────────┘
```

## 주요 컴포넌트 상세

### 1. 음성 입력 모듈
- **기능**: 
  - 브라우저에서 실시간 음성 녹음
  - 음성 파일 업로드 지원 (mp3, wav, m4a)
  - 녹음 일시정지/재개 기능
- **구현**:
  - MediaRecorder API 활용
  - 음성 파일을 Cloud Storage에 임시 저장
  - Speech-to-Text API로 텍스트 변환

### 2. 텍스트 처리 및 저장 모듈
- **기능**:
  - 변환된 텍스트 편집 기능
  - 메모 제목 자동 생성 (Gemini Pro)
  - 태그 및 카테고리 분류
- **구현**:
  - Text Embeddings API로 벡터 변환
  - 메타데이터와 함께 PostgreSQL 저장
  - 벡터는 Vertex AI Vector Search에 인덱싱

### 3. RAG 검색 모듈
- **기능**:
  - 자연어 쿼리로 메모 검색
  - 유사도 기반 관련 메모 추천
  - 검색 결과 요약 및 인사이트 제공
- **구현**:
  - 쿼리를 벡터로 변환
  - Vector Search에서 유사 문서 검색
  - Gemini Pro로 컨텍스트 기반 응답 생성

### 4. 사용자 인터페이스
- **주요 화면**:
  - 메인 대시보드 (최근 메모 목록)
  - 음성 녹음 화면
  - 메모 상세 보기/편집
  - 검색 및 RAG 대화 인터페이스
  - 설정 페이지

## API 엔드포인트

### 음성 관련
- `POST /api/voice/upload` - 음성 파일 업로드
- `POST /api/voice/transcribe` - 음성을 텍스트로 변환
- `GET /api/voice/{id}` - 음성 파일 다운로드

### 메모 관련
- `POST /api/memos` - 새 메모 생성
- `GET /api/memos` - 메모 목록 조회
- `GET /api/memos/{id}` - 특정 메모 조회
- `PUT /api/memos/{id}` - 메모 수정
- `DELETE /api/memos/{id}` - 메모 삭제

### 검색 및 RAG
- `POST /api/search` - 벡터 유사도 검색
- `POST /api/rag/query` - RAG 기반 질의응답
- `GET /api/rag/suggestions` - 관련 질문 추천

## 데이터 모델

### Memo
```python
{
    "id": "uuid",
    "user_id": "string",
    "title": "string",
    "content": "string",
    "audio_url": "string",
    "tags": ["string"],
    "category": "string",
    "created_at": "datetime",
    "updated_at": "datetime",
    "duration": "integer",  # 초 단위
    "embedding_id": "string"  # Vector Search 참조
}
```

### User
```python
{
    "id": "uuid",
    "email": "string",
    "name": "string",
    "created_at": "datetime",
    "settings": {
        "language": "string",
        "auto_transcribe": "boolean",
        "default_category": "string"
    }
}
```

## 보안 고려사항
1. **인증/인가**
   - JWT 토큰 기반 인증
   - 사용자별 데이터 격리
   - API 키 보안 관리

2. **데이터 보호**
   - HTTPS 통신
   - 음성 파일 암호화 저장
   - 개인정보 마스킹 옵션

3. **Rate Limiting**
   - API 호출 제한
   - 파일 업로드 크기 제한

## 개발 로드맵

### Phase 1: MVP (2-3주)
- [ ] 기본 백엔드 API 구축
- [ ] 음성 녹음 및 텍스트 변환 기능
- [ ] 메모 CRUD 기능
- [ ] 간단한 웹 UI

### Phase 2: RAG 통합 (2-3주)
- [ ] Vector Search 설정 및 통합
- [ ] 임베딩 생성 파이프라인
- [ ] RAG 검색 기능 구현
- [ ] 대화형 인터페이스

### Phase 3: 고급 기능 (2-3주)
- [ ] 실시간 전사 기능
- [ ] 다국어 지원
- [ ] 메모 공유 기능
- [ ] 분석 대시보드

### Phase 4: 최적화 및 배포 (1-2주)
- [ ] 성능 최적화
- [ ] 보안 강화
- [ ] 프로덕션 배포
- [ ] 모니터링 설정

## 예상 비용
- **Vertex AI APIs**: 
  - Speech-to-Text: $0.006/15초
  - Text Embeddings: $0.0001/1000자
  - Gemini Pro: $0.00025/1000자
- **인프라**:
  - Cloud Run: ~$50/월
  - Cloud Storage: ~$10/월
  - PostgreSQL: ~$30/월

## 성공 지표
1. 음성 인식 정확도 > 95%
2. 검색 응답 시간 < 2초
3. RAG 응답 관련성 점수 > 0.8
4. 일일 활성 사용자 > 100명

## 참고 자료
- [Vertex AI Speech-to-Text](https://cloud.google.com/speech-to-text)
- [Vertex AI Embeddings](https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings)
- [Vertex AI Vector Search](https://cloud.google.com/vertex-ai/docs/vector-search)
- [Gemini API](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)