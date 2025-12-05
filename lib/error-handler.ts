/**
 * Error Handling Utilities
 * Centralized error handling and logging
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;

  constructor(message: string, code?: string, statusCode?: number, details?: any) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle API errors and return user-friendly messages
 */
export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return new AppError(
        "Network error. Please check your connection and try again.",
        "NETWORK_ERROR",
        0
      );
    }

    // Check for timeout errors
    if (error.message.includes("timeout")) {
      return new AppError(
        "Request timed out. Please try again.",
        "TIMEOUT_ERROR",
        408
      );
    }

    return new AppError(error.message, "UNKNOWN_ERROR", 500);
  }

  return new AppError(
    "An unexpected error occurred",
    "UNKNOWN_ERROR",
    500
  );
}

/**
 * Log error to console (and optionally to error tracking service)
 */
export function logError(error: Error | AppError, context?: string) {
  const errorInfo = {
    message: error.message,
    code: error instanceof AppError ? error.code : undefined,
    statusCode: error instanceof AppError ? error.statusCode : undefined,
    context,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  };

  console.error("Error:", errorInfo);

  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to Sentry or other error tracking service
    // Sentry.captureException(error, { extra: errorInfo });
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  const appError = handleApiError(error);

  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
    TIMEOUT_ERROR: "The request took too long. Please try again.",
    UNAUTHORIZED: "You need to sign in to continue.",
    FORBIDDEN: "You don't have permission to perform this action.",
    NOT_FOUND: "The requested resource was not found.",
    VALIDATION_ERROR: "Please check your input and try again.",
    RATE_LIMIT_ERROR: "Too many requests. Please wait a moment and try again.",
    SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  };

  return errorMessages[appError.code || ""] || appError.message || "An unexpected error occurred";
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

