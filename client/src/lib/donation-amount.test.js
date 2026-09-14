import { describe, expect, it } from 'vitest';
import { parseDonationAmount } from './donation-amount';

describe('parseDonationAmount', () => {
  it.each([
    ['25', 2500],
    ['25.5', 2550],
    ['25.50', 2550],
    [' 1 ', 100],
    ['10000', 1_000_000],
  ])('converts "%s" to %i cents', (input, cents) => {
    expect(parseDonationAmount(input)).toEqual({ cents });
  });

  it.each([
    ['', 'Enter an amount'],
    ['abc', 'Enter a valid amount, like 25 or 25.50'],
    ['-5', 'Enter a valid amount, like 25 or 25.50'],
    ['10.999', 'Enter a valid amount, like 25 or 25.50'],
    ['0.50', 'The minimum donation is $1'],
    ['10000.01', 'The maximum donation is $10,000'],
  ])('rejects "%s"', (input, error) => {
    expect(parseDonationAmount(input)).toEqual({ error });
  });
});
