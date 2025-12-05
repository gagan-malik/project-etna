import {
  checkRateLimit,
  clearRateLimit,
  getRateLimitHeaders,
} from "@/lib/rate-limit";

describe("Rate Limiting", () => {
  beforeEach(() => {
    clearRateLimit("test-user");
  });

  it("should allow requests within limit", () => {
    const result = checkRateLimit("test-user", "/api/test", {
      maxRequests: 5,
      windowMs: 60000,
    });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it("should block requests exceeding limit", () => {
    const config = { maxRequests: 2, windowMs: 60000 };

    // Make 2 requests
    checkRateLimit("test-user", "/api/test", config);
    checkRateLimit("test-user", "/api/test", config);

    // Third request should be blocked
    const result = checkRateLimit("test-user", "/api/test", config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should reset after window expires", async () => {
    const config = { maxRequests: 1, windowMs: 100 }; // 100ms window

    // First request
    checkRateLimit("test-user", "/api/test", config);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should be allowed again
    const result = checkRateLimit("test-user", "/api/test", config);
    expect(result.allowed).toBe(true);
  });

  it("should return rate limit headers", () => {
    const result = checkRateLimit("test-user", "/api/test");
    const headers = getRateLimitHeaders(result.remaining, result.resetTime);

    expect(headers["X-RateLimit-Remaining"]).toBeDefined();
    expect(headers["X-RateLimit-Reset"]).toBeDefined();
    expect(headers["X-RateLimit-Reset-After"]).toBeDefined();
  });
});

