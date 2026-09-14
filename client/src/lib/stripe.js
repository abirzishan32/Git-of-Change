import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const isStripeConfigured = Boolean(publishableKey);
export const isStripeTestMode = Boolean(publishableKey?.startsWith('pk_test_'));

// Created once at module load, as Stripe recommends, and only when a key is set
export const stripePromise = isStripeConfigured ? loadStripe(publishableKey) : null;
