import mongoose from 'mongoose';
import { ApiError } from '../utils/api-error.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Express recognises error handlers by their four arguments, so `_next` must stay.
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const [first] = Object.values(err.errors);
    return res.status(400).json({ message: first.message });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ message: 'A record with these details already exists' });
  }

  // Errors from the Stripe SDK (StripeInvalidRequestError, StripeConnectionError, ...)
  if (typeof err?.type === 'string' && err.type.startsWith('Stripe')) {
    console.error('Stripe error:', err.message);
    return res
      .status(502)
      .json({ message: 'The payment provider returned an error. Please try again.' });
  }

  // Errors raised by body-parser (malformed JSON, payload too large, ...)
  if (err?.expose && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
}
