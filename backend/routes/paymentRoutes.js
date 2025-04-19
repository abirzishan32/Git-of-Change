const express = require('express');
const { 
  createPaymentIntent, 
  recordDonation, 
  getDonationHistory 
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Payment routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/record-donation', protect, recordDonation);
router.get('/donation-history', protect, getDonationHistory);

module.exports = router; 