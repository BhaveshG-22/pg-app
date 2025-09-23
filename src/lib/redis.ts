import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL!,
      socket: {
        tls: true,
        rejectUnauthorized: false // Allow self-signed certificates for Aiven Redis
      }
    });
    redis.on('error', (err: any) => console.error('Redis Client Error', err));
    await redis.connect();
  }
  return redis;
}