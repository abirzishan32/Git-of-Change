const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/donationModel');

// @desc    Create a payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, donationCategory } = req.body;
  
  if (!amount || amount < 100) {
    res.status(400);
    throw new Error('Please provide a valid donation amount (minimum $1)');
  }

  if (!donationCategory) {
    res.status(400);
    throw new Error('Please select a donation category');
  }

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        donationCategory: donationCategory,
      },
    });

    // Send the client secret to the client
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500);
    throw new Error('Error creating payment intent');
  }
});

// @desc    Record a successful donation
// @route   POST /api/payments/record-donation
// @access  Private
const recordDonation = asyncHandler(async (req, res) => {
  const { amount, paymentIntentId, donationCategory } = req.body;
  
  if (!amount || !paymentIntentId || !donationCategory) {
    res.status(400);
    throw new Error('Missing required donation information');
  }

  try {
    // Create a new donation record
    const newDonation = await Donation.create({
      user: req.user._id,
      amount: amount / 100, // Convert from cents to dollars for storage
      paymentIntentId,
      donationCategory: donationCategory,
      status: 'completed',
    });
    
    res.status(201).json(newDonation);
  } catch (error) {
    console.error('Record donation error:', error);
    res.status(500);
    throw new Error('Error recording donation');
  }
});

// @desc    Get donation history for a user
// @route   GET /api/payments/donation-history
// @access  Private
const getDonationHistory = asyncHandler(async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error('Get donation history error:', error);
    res.status(500);
    throw new Error('Error fetching donation history');
  }
});

module.exports = {
  createPaymentIntent,
  recordDonation,
  getDonationHistory
}; 