// Keep in sync with client/src/constants/causes.js
export const DONATION_CATEGORIES = [
  'education',
  'health',
  'poverty',
  'disaster-relief',
  'animal-welfare',
];

export const DONATION_STATUSES = ['pending', 'completed', 'failed'];

// Amounts are in cents, like Stripe expects them
export const MIN_DONATION_CENTS = 100; // $1
export const MAX_DONATION_CENTS = 1_000_000; // $10,000

export const CURRENCY = 'usd';
