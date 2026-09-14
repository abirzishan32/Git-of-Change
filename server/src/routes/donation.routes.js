import { Router } from 'express';
import {
  createPaymentIntent,
  getDonationStats,
  listDonations,
  listMyDonations,
  syncPaymentIntent,
} from '../controllers/donation.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { paymentLimiter } from '../middleware/rate-limit.js';
import { validate } from '../middleware/validate.js';
import {
  createPaymentIntentSchema,
  listDonationsQuerySchema,
  paymentIntentParamsSchema,
} from '../validators/donation.schemas.js';

const router = Router();

router.get('/stats', getDonationStats);

router.post(
  '/payment-intent',
  requireAuth,
  paymentLimiter,
  validate(createPaymentIntentSchema),
  createPaymentIntent,
);
router.post(
  '/payment-intent/:paymentIntentId/sync',
  requireAuth,
  validate(paymentIntentParamsSchema, 'params'),
  syncPaymentIntent,
);

router.get('/me', requireAuth, listMyDonations);
router.get(
  '/',
  requireAuth,
  requireRole('admin'),
  validate(listDonationsQuerySchema, 'query'),
  listDonations,
);

export default router;
