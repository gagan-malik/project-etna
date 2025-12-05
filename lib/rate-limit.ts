/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting (for production, use Redis or similar)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production)
const store: RateLimitStore = {};

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const defaultRateLimits: Record<string, RateLimitConfig> = {
  // API routes
  "/api/messages/stream": { maxRequests: 10, windowMs: 60000 }, // 10 per minute
  "/api/conversations": { maxRequests: 30, windowMs: 60000 }, // 30 per minute
  "/api/messages": { maxRequests: 60, windowMs: 60000 }, // 60 per minute
  "/api/files/upload": { maxRequests: 20, windowMs: 60000 }, // 20 per minute
  "/api/integrations/[id]/sync": { maxRequests: 5, windowMs: 300000 }, // 5 per 5 minutes
  default: { maxRequests: 100, windowMs: 60000 }, // 100 per minute
};

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  path: string,
  config?: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const limitConfig = config || getRateLimitForPath(path);
  const key = `${identifier}:${path}`;
  const now = Date.now();

  // Clean up expired entries
  if (store[key] && store[key].resetTime < now) {
    delete store[key];
  }

  // Initialize or get existing entry
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + limitConfig.windowMs,
    };
  }

  const entry = store[key];

  // Check if limit exceeded
  if (entry.count >= limitConfig.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  return {
    allowed: true,
    remaining: limitConfig.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get rate limit config for a path
 */
function getRateLimitForPath(path: string): RateLimitConfig {
  // Match specific paths
  for (const [pattern, config] of Object.entries(defaultRateLimits)) {
    if (pattern === "default") continue;
    if (path.includes(pattern.replace("[id]", ""))) {
      return config;
    }
  }

  return defaultRateLimits.default;
}

/**
 * Get rate limit headers
 */
export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": resetTime.toString(),
    "X-RateLimit-Reset-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
  };
}

/**
 * Clear rate limit for identifier (useful for testing)
 */
export function clearRateLimit(identifier: string, path?: string): void {
  if (path) {
    delete store[`${identifier}:${path}`];
  } else {
    // Clear all entries for this identifier
    Object.keys(store).forEach((key) => {
      if (key.startsWith(`${identifier}:`)) {
        delete store[key];
      }
    });
  }
}

