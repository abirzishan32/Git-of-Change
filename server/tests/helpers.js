import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Donation } from '../src/models/donation.model.js';
import { User } from '../src/models/user.model.js';
import { signToken } from '../src/utils/token.js';

const app = createApp();

export const api = () => request(app);

export async function createUser(overrides = {}) {
  const user = await User.create({
    name: 'Test User',
    email: `user-${randomUUID()}@example.com`,
    password: 'password123',
    ...overrides,
  });
  const token = signToken(user);
  return { user, token, auth: { Authorization: `Bearer ${token}` } };
}

export function createAdmin(overrides = {}) {
  return createUser({ name: 'Test Admin', role: 'admin', ...overrides });
}

export function createDonation(user, overrides = {}) {
  return Donation.create({
    user: user._id,
    amount: 2500,
    category: 'education',
    status: 'completed',
    paymentIntentId: `pi_${randomUUID().replaceAll('-', '')}`,
    ...overrides,
  });
}

export function fakePaymentIntent(user, overrides = {}) {
  return {
    id: `pi_${randomUUID().replaceAll('-', '')}`,
    object: 'payment_intent',
    amount: 5000,
    currency: 'usd',
    status: 'succeeded',
    client_secret: 'pi_secret_123',
    metadata: { userId: user.id, category: 'health' },
    ...overrides,
  };
}
