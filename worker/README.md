# PixelGlow Worker

This is the background worker service for PixelGlow that processes image generation jobs.

## Deployment on Render

1. **Connect Repository**: Connect your GitHub repository to Render
2. **Service Type**: Background Worker
3. **Root Directory**: Set to `worker`
4. **Runtime**: Node.js
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`

## Environment Variables

Copy all environment variables from your main app's `.env.local` to Render:

### Required Variables:
- `DATABASE_URL` - Your PostgreSQL database URL
- `REDIS_URL` - Your Redis instance URL (must be accessible from both Vercel and Render)
- `AWS_ACCESS_KEY_ID` - AWS access key for S3
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `S3_BUCKET_NAME` - Your S3 bucket name

### Provider API Keys (as needed):
- `OPENAI_API_KEY`
- `REPLICATE_API_TOKEN`
- `SEEDREAM_API_KEY`
- `STABLE_DIFFUSION_API_KEY`
- `FLUX_KONTEXT_API_KEY`
- `NANO_BANANA_API_KEY`

### Optional:
- `WORKER_CONCURRENCY` - Number of concurrent jobs (default: 6)

## Local Development

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   Or create a symlink to share with main app:
   ```bash
   ln -s ../.env.local .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the worker:
   ```bash
   npm start
   ```

## Architecture

- **Queue**: Uses BullMQ with Redis for job queue management
- **Database**: Connects to the same PostgreSQL database as the main app
- **Storage**: Uses AWS S3 for image storage
- **Providers**: Supports multiple AI image generation providers

## Scaling

- Increase `WORKER_CONCURRENCY` for more parallel processing
- Deploy multiple worker instances for horizontal scaling
- Monitor Redis memory usage and scale as needed