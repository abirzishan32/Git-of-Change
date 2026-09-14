import { z } from 'zod';
import {
  DONATION_CATEGORIES,
  DONATION_STATUSES,
  MAX_DONATION_CENTS,
  MIN_DONATION_CENTS,
} from '../constants/donations.js';
import { paginationSchema } from './common.schemas.js';

export const createPaymentIntentSchema = z.object({
  amount: z
    .int({ error: 'Amount must be a whole number of cents' })
    .min(MIN_DONATION_CENTS, 'The minimum donation is $1')
    .max(MAX_DONATION_CENTS, 'The maximum donation is $10,000'),
  category: z.enum(DONATION_CATEGORIES, { error: 'Please choose a valid cause' }),
});

export const paymentIntentParamsSchema = z.object({
  paymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]+$/, 'Invalid payment intent id'),
});

export const listDonationsQuerySchema = paginationSchema.extend({
  status: z.enum(DONATION_STATUSES).optional(),
});
