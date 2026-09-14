import Stripe from 'stripe';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

let client;

/**
 * Lazily creates the Stripe client so the API can still boot (and serve
 * everything except payments) when no Stripe key is configured.
 */
export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new ApiError(503, 'Payments are not configured on this server');
  }
  client ??= new Stripe(env.STRIPE_SECRET_KEY);
  return client;
}
