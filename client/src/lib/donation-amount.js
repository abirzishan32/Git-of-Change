// Must match the limits enforced by the API (server/src/constants/donations.js)
export const MIN_DONATION_CENTS = 100;
export const MAX_DONATION_CENTS = 1_000_000;

export const PRESET_AMOUNTS_CENTS = [1000, 2500, 5000, 10000];

/**
 * Validates what the donor typed into the "custom amount" field.
 * Returns the amount in cents, or an error message.
 */
export function parseDonationAmount(input) {
  const value = String(input).trim();

  if (!value) {
    return { error: 'Enter an amount' };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return { error: 'Enter a valid amount, like 25 or 25.50' };
  }

  const cents = Math.round(Number(value) * 100);

  if (cents < MIN_DONATION_CENTS) {
    return { error: 'The minimum donation is $1' };
  }
  if (cents > MAX_DONATION_CENTS) {
    return { error: 'The maximum donation is $10,000' };
  }

  return { cents };
}
