import mongoose from 'mongoose';
import { DONATION_CATEGORIES } from '../constants/donations.js';
import { Donation } from '../models/donation.model.js';

// How a Stripe PaymentIntent status maps onto a donation status. Anything not
// listed (requires_action, requires_confirmation, ...) means the donor is still
// in the middle of checkout, so there is nothing to record yet.
const STATUS_BY_PAYMENT_INTENT = {
  processing: 'pending',
  succeeded: 'completed',
  requires_payment_method: 'failed',
  canceled: 'failed',
};

/**
 * Creates or updates the donation that belongs to a Stripe PaymentIntent.
 *
 * The amount, donor and cause all come from the PaymentIntent that Stripe
 * returned, never from the browser. This runs from both the webhook and the
 * client-triggered sync, so it is idempotent and tolerates the two racing.
 */
export async function syncDonationFromPaymentIntent(paymentIntent, { isRetry = false } = {}) {
  const status = STATUS_BY_PAYMENT_INTENT[paymentIntent.status];
  const { userId, category } = paymentIntent.metadata ?? {};

  if (!status || !mongoose.isValidObjectId(userId) || !DONATION_CATEGORIES.includes(category)) {
    return null;
  }

  const filter = { paymentIntentId: paymentIntent.id };

  if (status === 'failed') {
    // A declined card doesn't create a record; only payments that were
    // already processing are marked as failed.
    await Donation.updateOne({ ...filter, status: 'pending' }, { status });
    return Donation.findOne(filter);
  }

  const update = {
    $setOnInsert: {
      user: userId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      category,
    },
  };

  if (status === 'completed') {
    update.$set = { status };
  } else {
    // Only set "pending" on insert so a late event can't undo a completion
    update.$setOnInsert.status = status;
  }

  try {
    return await Donation.findOneAndUpdate(filter, update, {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
    });
  } catch (err) {
    // The webhook and the client sync inserted at the same moment; the
    // document exists now, so a second attempt becomes a plain update.
    if (err.code === 11000 && !isRetry) {
      return syncDonationFromPaymentIntent(paymentIntent, { isRetry: true });
    }
    throw err;
  }
}
