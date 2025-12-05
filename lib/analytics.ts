/**
 * Analytics and Monitoring Utilities
 * Tracks usage, performance, and errors
 */

interface AnalyticsEvent {
  type: string;
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
}

// In-memory analytics store (use a proper analytics service in production)
const events: AnalyticsEvent[] = [];

/**
 * Track an analytics event
 */
export function trackEvent(
  name: string,
  properties?: Record<string, any>,
  userId?: string
): void {
  const event: AnalyticsEvent = {
    type: "event",
    name,
    properties,
    timestamp: Date.now(),
    userId,
  };

  events.push(event);

  // In production, send to analytics service (e.g., PostHog, Mixpanel, etc.)
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to analytics service
    // analytics.track(name, properties, userId);
  } else {
    // Log in development
    console.log("[Analytics]", name, properties);
  }
}

/**
 * Track API call
 */
export function trackApiCall(
  endpoint: string,
  method: string,
  duration: number,
  statusCode: number,
  userId?: string
): void {
  trackEvent("api_call", {
    endpoint,
    method,
    duration,
    statusCode,
  }, userId);
}

/**
 * Track AI usage
 */
export function trackAIUsage(
  provider: string,
  model: string,
  tokens?: number,
  cost?: number,
  userId?: string
): void {
  trackEvent("ai_usage", {
    provider,
    model,
    tokens,
    cost,
  }, userId);
}

/**
 * Track error
 */
export function trackError(
  error: Error,
  context?: string,
  userId?: string
): void {
  trackEvent("error", {
    message: error.message,
    stack: error.stack,
    context,
  }, userId);
}

/**
 * Get analytics summary (for admin/dashboard)
 */
export function getAnalyticsSummary(userId?: string): {
  totalEvents: number;
  eventsByType: Record<string, number>;
  recentEvents: AnalyticsEvent[];
} {
  let filteredEvents = events;

  if (userId) {
    filteredEvents = events.filter((e) => e.userId === userId);
  }

  const eventsByType: Record<string, number> = {};
  filteredEvents.forEach((event) => {
    eventsByType[event.name] = (eventsByType[event.name] || 0) + 1;
  });

  return {
    totalEvents: filteredEvents.length,
    eventsByType,
    recentEvents: filteredEvents.slice(-100).reverse(), // Last 100 events
  };
}

/**
 * Clear analytics (for testing)
 */
export function clearAnalytics(): void {
  events.length = 0;
}

