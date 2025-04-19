const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    donationCategory: {
      type: String,
      required: true,
      enum: ['Education', 'Health & Medicine', 'Poverty & Hunger', 'Disaster Relief', 'Animal Welfare', 'General'],
      default: 'General',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation; 