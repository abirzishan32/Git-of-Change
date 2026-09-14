/**
 * An error that is safe to show to API clients. Anything else thrown inside a
 * route handler is logged and answered with a generic 500.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}
