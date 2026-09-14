import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import authRoutes from './routes/auth.routes.js';
import donationRoutes from './routes/donation.routes.js';
import userRoutes from './routes/user.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

export function createApp() {
  const app = express();

  // Needed for correct client IPs (rate limiting) behind Render, Railway, Heroku, ...
  app.set('trust proxy', env.TRUST_PROXY ? 1 : false);

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URLS }));
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Mounted before express.json() so the webhook receives the raw request body
  app.use('/api/webhooks', webhookRoutes);

  app.use(express.json({ limit: '10kb' }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/users', userRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
