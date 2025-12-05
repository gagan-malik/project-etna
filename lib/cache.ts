/**
 * Caching Utilities
 * Simple in-memory cache (use Redis in production)
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached value
 */
export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  
  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cached value
 */
export function setCache<T>(key: string, data: T, ttlMs: number = 60000): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Delete cached value
 */
export function deleteCache(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  conversation: (id: string) => `conversation:${id}`,
  conversations: (userId: string) => `conversations:${userId}`,
  messages: (conversationId: string) => `messages:${conversationId}`,
  documents: (userId: string, spaceId?: string) => 
    spaceId ? `documents:${userId}:${spaceId}` : `documents:${userId}`,
  integrations: (userId: string) => `integrations:${userId}`,
};

/**
 * Cache with automatic key generation
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = 60000
): Promise<T> {
  const cached = getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fn();
  setCache(key, data, ttlMs);
  return data;
}

