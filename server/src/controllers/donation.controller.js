import { CURRENCY } from '../constants/donations.js';
import { Donation } from '../models/donation.model.js';
import { syncDonationFromPaymentIntent } from '../services/donation-sync.js';
import { getStripe } from '../services/stripe.js';
import { ApiError } from '../utils/api-error.js';
import { buildPagination } from '../utils/pagination.js';

// POST /api/donations/payment-intent
export async function createPaymentIntent(req, res) {
  const { amount, category } = req.valid.body;

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: CURRENCY,
    automatic_payment_methods: { enabled: true },
    description: `Gift of Change donation: ${category}`,
    receipt_email: req.user.email,
    // The donation record is built from this metadata once Stripe reports the payment
    metadata: { userId: req.user.id, category },
  });

  res.status(201).json({ clientSecret: paymentIntent.client_secret });
}

// POST /api/donations/payment-intent/:paymentIntentId/sync
// Called by the browser right after checkout so the donor sees their donation
// immediately, without waiting for the webhook. The status is read from Stripe.
export async function syncPaymentIntent(req, res) {
  const { paymentIntentId } = req.valid.params;

  let paymentIntent;
  try {
    paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    if (err.statusCode === 404) throw new ApiError(404, 'Payment not found');
    throw err;
  }

  // Respond the same way for someone else's payment so ids can't be probed
  if (paymentIntent.metadata?.userId !== req.user.id) {
    throw new ApiError(404, 'Payment not found');
  }

  const donation = await syncDonationFromPaymentIntent(paymentIntent);
  res.json({ paymentStatus: paymentIntent.status, donation });
}

// GET /api/donations/me
export async function listMyDonations(req, res) {
  const donations = await Donation.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ donations });
}

// GET /api/donations (admin)
export async function listDonations(req, res) {
  const { page, limit, status } = req.valid.query;
  const filter = status ? { status } : {};

  const [donations, total] = await Promise.all([
    Donation.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email'),
    Donation.countDocuments(filter),
  ]);

  res.json({ donations, pagination: buildPagination({ page, limit }, total) });
}

// GET /api/donations/stats (public: powers the impact numbers on the home page)
export async function getDonationStats(_req, res) {
  const [{ totals, byCategory }] = await Donation.aggregate([
    { $match: { status: 'completed' } },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalRaised: { $sum: '$amount' },
              donationCount: { $sum: 1 },
              donors: { $addToSet: '$user' },
            },
          },
          {
            $project: {
              _id: 0,
              totalRaised: 1,
              donationCount: 1,
              donorCount: { $size: '$donors' },
            },
          },
        ],
        byCategory: [
          {
            $group: {
              _id: '$category',
              totalRaised: { $sum: '$amount' },
              donationCount: { $sum: 1 },
            },
          },
          { $project: { _id: 0, category: '$_id', totalRaised: 1, donationCount: 1 } },
          { $sort: { totalRaised: -1, category: 1 } },
        ],
      },
    },
  ]);

  res.json({
    totalRaised: 0,
    donationCount: 0,
    donorCount: 0,
    ...totals[0],
    byCategory,
  });
}
