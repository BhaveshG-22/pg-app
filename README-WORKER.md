# Image Generation Worker Setup

## Overview
The worker processes image generation jobs from the BullMQ queue using OpenAI's DALL-E 3.

## Setup Requirements

### 1. Environment Variables
Add to your `.env.local`:
```bash
# OpenAI API Key (required)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Redis URL (required for queue)
REDIS_URL=redis://localhost:6379

# Worker Configuration (optional)
WORKER_CONCURRENCY=6
```

### 2. Redis Server
Start Redis locally:
```bash
# macOS (with Homebrew)
brew install redis
brew services start redis

# Or using Docker
docker run -d -p 6379:6379 redis:latest
```

### 3. Running the Worker

#### Development Mode (with auto-restart)
```bash
npm run worker:dev
```

#### Production Mode
```bash
npm run worker
```

## Architecture

1. **API Route** (`/api/generations`) - Queues jobs
2. **Worker** (`worker.ts`) - Processes jobs
3. **Engine** (`src/lib/engine.ts`) - OpenAI integration
4. **Queue** (`src/lib/queue.ts`) - BullMQ configuration

## Flow
1. Frontend calls `/api/generations` with preset & input values
2. API validates, deducts credits, creates DB record, queues job
3. Worker picks up job, updates status to 'RUNNING'
4. Worker calls OpenAI DALL-E 3 via engine
5. Worker updates DB with result URL and status 'COMPLETED'
6. Frontend polls `/api/generations/[id]` until completed

## Monitoring
Worker logs job processing and errors to console.
Check BullMQ dashboard for queue monitoring if needed.

## Troubleshooting
- Ensure Redis is running
- Check OpenAI API key is valid
- Verify environment variables are loaded
- Check database connectivity