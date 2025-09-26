const { createClient } = require('redis');

let redis = null;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
      socket: process.env.REDIS_URL?.includes('rediss://') ? {
        tls: true,
        rejectUnauthorized: false // Allow self-signed certificates for Aiven Redis
      } : undefined
    });
    redis.on('error', (err) => console.error('Redis Client Error', err));
    await redis.connect();
  }
  return redis;
}

module.exports = { getRedisClient };