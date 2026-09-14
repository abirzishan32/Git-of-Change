import Stripe from 'stripe';
import { describe, expect, it, vi } from 'vitest';
import { Donation } from '../src/models/donation.model.js';
import { api, createUser, fakePaymentIntent } from './helpers.js';

// Real signature verification with a fake key: no network calls are made
vi.mock('../src/services/stripe.js', async () => {
  const { default: StripeSdk } = await import('stripe');
  const client = new StripeSdk('sk_test_not_a_real_key');
  return { getStripe: () => client };
});

const WEBHOOK_SECRET = 'whsec_test_secret';
const { webhooks } = new Stripe('sk_test_not_a_real_key');

function sendEvent(type, paymentIntent, { secret = WEBHOOK_SECRET } = {}) {
  const payload = JSON.stringify({
    id: `evt_${paymentIntent.id}`,
    object: 'event',
    type,
    data: { object: paymentIntent },
  });
  const signature = webhooks.generateTestHeaderString({ payload, secret });

  return api()
    .post('/api/webhooks/stripe')
    .set('Content-Type', 'application/json')
    .set('Stripe-Signature', signature)
    .send(payload);
}

describe('POST /api/webhooks/stripe', () => {
  it('rejects events that were not signed by Stripe', async () => {
    const { user } = await createUser();

    const res = await sendEvent('payment_intent.succeeded', fakePaymentIntent(user), {
      secret: 'whsec_attacker',
    });

    expect(res.status).toBe(400);
    expect(await Donation.countDocuments()).toBe(0);
  });

  it('records a completed donation when a payment succeeds', async () => {
    const { user } = await createUser();
    const paymentIntent = fakePaymentIntent(user, { amount: 7500 });

    const res = await sendEvent('payment_intent.succeeded', paymentIntent);

    expect(res.status).toBe(200);
    const donation = await Donation.findOne({ paymentIntentId: paymentIntent.id });
    expect(donation).toMatchObject({ amount: 7500, category: 'health', status: 'completed' });
  });

  it('tracks a delayed payment from processing to failed', async () => {
    const { user } = await createUser();
    const paymentIntent = fakePaymentIntent(user, { status: 'processing' });

    await sendEvent('payment_intent.processing', paymentIntent);
    expect(await Donation.findOne({ paymentIntentId: paymentIntent.id })).toMatchObject({
      status: 'pending',
    });

    await sendEvent('payment_intent.payment_failed', {
      ...paymentIntent,
      status: 'requires_payment_method',
    });
    expect(await Donation.findOne({ paymentIntentId: paymentIntent.id })).toMatchObject({
      status: 'failed',
    });
  });

  it('does not let a late "processing" event undo a completed donation', async () => {
    const { user } = await createUser();
    const paymentIntent = fakePaymentIntent(user);

    await sendEvent('payment_intent.succeeded', paymentIntent);
    await sendEvent('payment_intent.processing', { ...paymentIntent, status: 'processing' });

    expect(await Donation.findOne({ paymentIntentId: paymentIntent.id })).toMatchObject({
      status: 'completed',
    });
  });

  it('does not create records for declined cards', async () => {
    const { user } = await createUser();
    const paymentIntent = fakePaymentIntent(user, { status: 'requires_payment_method' });

    await sendEvent('payment_intent.payment_failed', paymentIntent);

    expect(await Donation.countDocuments()).toBe(0);
  });

  it('ignores PaymentIntents that did not come from this app', async () => {
    const { user } = await createUser();

    const res = await sendEvent(
      'payment_intent.succeeded',
      fakePaymentIntent(user, { metadata: { orderId: '42' } }),
    );

    expect(res.status).toBe(200);
    expect(await Donation.countDocuments()).toBe(0);
  });
});
