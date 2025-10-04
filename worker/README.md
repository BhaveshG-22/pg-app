# PixelGlow Worker

This worker is a background job processor for PixelGlow, an AI image generation service.

## Core Functionality

- **Queue Processing**: Listens to 'image-generate' queue using BullMQ with configurable concurrency
- **Credit Management**: Atomic credit transactions to prevent double-charging users
- **AI Image Generation**: Uses Nano Banana provider via Replicate for image generation
- **S3 Storage**: Uploads generated images to AWS S3 with presigned URLs
- **Error Handling**: Retries transient errors and refunds credits on final failures
- **Rate Limiting**: Built-in rate limiter to avoid provider API limits

## Job Flow

1. Receives job with `generationId` from Redis queue
2. Loads generation data from PostgreSQL database
3. Atomically deducts user credits
4. Builds final prompt by replacing placeholders with user inputs
5. Calls Nano Banana AI provider to generate image
6. Downloads result and uploads to S3
7. Updates database with completion status and S3 URL
8. Refunds credits if job fails after all retries

## Setup

### 1. Install Dependencies

```bash
cd worker
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://username:password@host:port/database"

# Redis (for job queue)
REDIS_URL="rediss://default:password@host:port"

# Replicate (for Nano Banana)
REPLICATE_API_TOKEN="r8_your_token_here"

# AWS S3 (for image storage)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="us-east-1"
S3_BUCKET="your-bucket-name"

# Worker settings
WORKER_CONCURRENCY=6
```

### 3. Generate Prisma Client

```bash
npm run build
```

### 4. Run the Worker

```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

## Architecture

### Components

- **`index.js`** - Main worker process with BullMQ integration
- **`engine.js`** - Core image generation engine
- **`providers/`** - AI provider implementations
  - **`nano-banana.js`** - Nano Banana provider via Replicate
- **`prisma.js`** - Database client configuration
- **`redis.js`** - Redis client for job queue
- **`s3.js`** - S3 client for image storage

### Credit System

The worker implements atomic credit transactions:

1. **Debit on Start**: Credits are deducted when job starts processing
2. **Refund on Failure**: Credits are refunded only on final failure (after all retries)
3. **No Double Charging**: Atomic transactions prevent race conditions

### Error Handling

- **Transient Errors**: Retried up to 3 times with exponential backoff
- **Rate Limits**: Built-in rate limiting to prevent API quota issues
- **Timeouts**: 12-second timeout for provider calls
- **Graceful Shutdown**: Handles SIGTERM/SIGINT for clean shutdowns

### Scaling

- **Horizontal Scaling**: Run multiple worker instances
- **Concurrency**: Configurable per-worker concurrency (default: 6)
- **Queue Management**: BullMQ handles job distribution across workers
- **Health Monitoring**: Event listeners for job status tracking

## Deployment

### Railway/Render

1. Deploy as a separate service from your main web app
2. Set environment variables in your platform's dashboard
3. Use the start command: `npm start`
4. Monitor logs for job processing status

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

All required environment variables must be set for the worker to function:

- **DATABASE_URL** - PostgreSQL connection string
- **REDIS_URL** - Redis connection string for job queue
- **REPLICATE_API_TOKEN** - API token for Replicate/Nano Banana
- **AWS_ACCESS_KEY_ID** - AWS access key for S3
- **AWS_SECRET_ACCESS_KEY** - AWS secret key for S3
- **S3_BUCKET** - S3 bucket name for image storage

## Monitoring

The worker provides comprehensive logging:

```bash
[Worker] PixelGlow Worker starting...
[Worker] Ready! Concurrency: 6
[Worker] Job active: 123 (gen_abc123)
[NanoBanana] Generating image: A beautiful sunset...
[Engine] Downloaded image, size: 156789 bytes
[Engine] Uploaded to S3: results/user123/gen_abc123-1234567890.webp
[Worker] Job completed successfully: gen_abc123 (8542ms)
```

## Troubleshooting

### Common Issues

1. **Redis Connection**: Check REDIS_URL and SSL settings
2. **Prisma Client**: Run `npm run build` to generate client
3. **S3 Permissions**: Ensure AWS credentials have S3 read/write access
4. **Rate Limits**: Monitor Replicate API usage and adjust concurrency

### Health Checks

The worker logs key events for monitoring:
- Worker startup and configuration
- Job processing status
- Error messages with generation IDs
- Credit transactions
- S3 upload confirmations