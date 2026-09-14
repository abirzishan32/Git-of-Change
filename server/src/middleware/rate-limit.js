import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';

const WINDOW_MS = 15 * 60 * 1000;

function createLimiter(limit, message) {
  return rateLimit({
    windowMs: WINDOW_MS,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => env.NODE_ENV === 'test',
    message: { message },
  });
}

export const authLimiter = createLimiter(
  20,
  'Too many login attempts. Please try again in a few minutes.',
);

export const paymentLimiter = createLimiter(
  30,
  'Too many payment attempts. Please try again in a few minutes.',
);
