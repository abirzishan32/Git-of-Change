import mongoose from 'mongoose';
import {
  CURRENCY,
  DONATION_CATEGORIES,
  DONATION_STATUSES,
  MIN_DONATION_CENTS,
} from '../constants/donations.js';

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // In cents. Always copied from the Stripe PaymentIntent, never from the client.
    amount: { type: Number, required: true, min: MIN_DONATION_CENTS },
    currency: { type: String, default: CURRENCY },
    category: { type: String, enum: DONATION_CATEGORIES, required: true },
    status: { type: String, enum: DONATION_STATUSES, default: 'pending', index: true },
    paymentIntentId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

donationSchema.index({ createdAt: -1 });

export const Donation = mongoose.model('Donation', donationSchema);
