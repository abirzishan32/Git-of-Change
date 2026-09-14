import express, { Router } from 'express';
import { handleStripeWebhook } from '../controllers/webhook.controller.js';

const router = Router();

// Stripe signs the exact bytes it sends, so this route needs the raw body
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
