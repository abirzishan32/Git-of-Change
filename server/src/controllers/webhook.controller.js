import { env } from '../config/env.js';
import { syncDonationFromPaymentIntent } from '../services/donation-sync.js';
import { getStripe } from '../services/stripe.js';
import { ApiError } from '../utils/api-error.js';

const HANDLED_EVENTS = new Set([
  'payment_intent.succeeded',
  'payment_intent.processing',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
]);

// POST /api/webhooks/stripe
// The source of truth for payments: records donations even if the donor
// closes the tab before the browser can report back.
export async function handleStripeWebhook(req, res) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new ApiError(503, 'Stripe webhooks are not configured on this server');
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      req.get('stripe-signature'),
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    throw new ApiError(400, 'Invalid Stripe signature');
  }

  if (HANDLED_EVENTS.has(event.type)) {
    await syncDonationFromPaymentIntent(event.data.object);
  }

  res.json({ received: true });
}
