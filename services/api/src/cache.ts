import { createClient, type RedisClientType } from 'redis';
import { config } from './config.js';
import { logger } from './logger.js';

// Shared cache for read-heavy public data. Postgres stays the source of truth: a miss, a
// connection error, or no REDIS_URL at all just serves the query. Checkout never reads this.
let client: RedisClientType | null = null;

export async function connectCache() {
  if (!config.REDIS_URL || client) return;
  const next = createClient({ url: config.REDIS_URL });
  next.on('error', (err) => logger.warn({ err }, 'redis error'));
  try {
    await next.connect();
    client = next as RedisClientType;
    logger.info('redis connected');
  } catch (err) {
    logger.warn({ err }, 'redis unavailable, catalog is served from postgres');
  }
}

export async function closeCache() {
  const current = client;
  client = null;
  await current?.quit().catch(() => undefined);
}

export async function cacheGet<T>(key: string): Promise<T | undefined> {
  if (!client) return undefined;
  try {
    const raw = await client.get(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch (err) {
    logger.warn({ err, key }, 'redis get failed');
    return undefined;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  if (!client) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    logger.warn({ err, key }, 'redis set failed');
  }
}

// One counter for the whole catalog. Writers increment it; readers put it in the key, so a
// stock or product edit drops every cached page without scanning keys.
export async function catalogGeneration(): Promise<string> {
  if (!client) return '0';
  try {
    return (await client.get('catalog:gen')) ?? '0';
  } catch {
    return '0';
  }
}

export async function bumpCatalog() {
  if (!client) return;
  try {
    await client.incr('catalog:gen');
  } catch (err) {
    logger.warn({ err }, 'redis catalog bump failed');
  }
}
