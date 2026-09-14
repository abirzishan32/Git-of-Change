import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Donation } from '../src/models/donation.model.js';
import { api, createAdmin, createDonation, createUser, fakePaymentIntent } from './helpers.js';

const stripe = vi.hoisted(() => ({
  paymentIntents: { create: vi.fn(), retrieve: vi.fn() },
}));

vi.mock('../src/services/stripe.js', () => ({ getStripe: () => stripe }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('POST /api/donations/payment-intent', () => {
  it('requires authentication', async () => {
    const res = await api()
      .post('/api/donations/payment-intent')
      .send({ amount: 1000, category: 'education' });
    expect(res.status).toBe(401);
  });

  it('creates a PaymentIntent tagged with the donor and cause', async () => {
    const { user, auth } = await createUser();
    stripe.paymentIntents.create.mockResolvedValue({ id: 'pi_123', client_secret: 'secret_123' });

    const res = await api()
      .post('/api/donations/payment-intent')
      .set(auth)
      .send({ amount: 2500, category: 'animal-welfare' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ clientSecret: 'secret_123' });
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 2500,
        currency: 'usd',
        metadata: { userId: user.id, category: 'animal-welfare' },
      }),
    );
    // Nothing is recorded until Stripe confirms the payment
    expect(await Donation.countDocuments()).toBe(0);
  });

  it.each([
    [{ amount: 'abc', category: 'education' }],
    [{ amount: 50, category: 'education' }],
    [{ amount: 10.5, category: 'education' }],
    [{ amount: 1_000_001, category: 'education' }],
    [{ amount: 1000, category: 'space-travel' }],
    [{ category: 'education' }],
  ])('rejects invalid input %j', async (body) => {
    const { auth } = await createUser();

    const res = await api().post('/api/donations/payment-intent').set(auth).send(body);

    expect(res.status).toBe(400);
    expect(stripe.paymentIntents.create).not.toHaveBeenCalled();
  });
});

describe('POST /api/donations/payment-intent/:id/sync', () => {
  it("records the donation using Stripe's data, not the client's", async () => {
    const { user, auth } = await createUser();
    const paymentIntent = fakePaymentIntent(user, { amount: 5000 });
    stripe.paymentIntents.retrieve.mockResolvedValue(paymentIntent);

    const res = await api()
      .post(`/api/donations/payment-intent/${paymentIntent.id}/sync`)
      .set(auth)
      .send({ amount: 99_999_900, status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.donation).toMatchObject({
      amount: 5000,
      category: 'health',
      status: 'completed',
      user: user.id,
    });
  });

  it('is idempotent', async () => {
    const { user, auth } = await createUser();
    const paymentIntent = fakePaymentIntent(user);
    stripe.paymentIntents.retrieve.mockResolvedValue(paymentIntent);

    const url = `/api/donations/payment-intent/${paymentIntent.id}/sync`;
    await Promise.all([api().post(url).set(auth), api().post(url).set(auth)]);

    expect(await Donation.countDocuments()).toBe(1);
  });

  it('does not record anything while the payment is unfinished', async () => {
    const { user, auth } = await createUser();
    const paymentIntent = fakePaymentIntent(user, { status: 'requires_action' });
    stripe.paymentIntents.retrieve.mockResolvedValue(paymentIntent);

    const res = await api()
      .post(`/api/donations/payment-intent/${paymentIntent.id}/sync`)
      .set(auth);

    expect(res.body).toEqual({ paymentStatus: 'requires_action', donation: null });
    expect(await Donation.countDocuments()).toBe(0);
  });

  it("hides other donors' payments", async () => {
    const { user: owner } = await createUser();
    const { auth } = await createUser();
    const paymentIntent = fakePaymentIntent(owner);
    stripe.paymentIntents.retrieve.mockResolvedValue(paymentIntent);

    const res = await api()
      .post(`/api/donations/payment-intent/${paymentIntent.id}/sync`)
      .set(auth);

    expect(res.status).toBe(404);
    expect(await Donation.countDocuments()).toBe(0);
  });

  it('rejects malformed ids before calling Stripe', async () => {
    const { auth } = await createUser();

    const res = await api().post('/api/donations/payment-intent/not-an-id/sync').set(auth);

    expect(res.status).toBe(400);
    expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
  });
});

describe('GET /api/donations/me', () => {
  it("returns only the signed-in donor's donations, newest first", async () => {
    const { user, auth } = await createUser();
    const { user: someoneElse } = await createUser();
    await createDonation(user, { createdAt: new Date('2025-01-01') });
    await createDonation(user, { createdAt: new Date('2025-02-01') });
    await createDonation(someoneElse);

    const res = await api().get('/api/donations/me').set(auth);

    expect(res.status).toBe(200);
    expect(res.body.donations).toHaveLength(2);
    expect(
      new Date(res.body.donations[0].createdAt) > new Date(res.body.donations[1].createdAt),
    ).toBe(true);
  });
});

describe('GET /api/donations', () => {
  it('is admin only', async () => {
    const { auth } = await createUser();
    const res = await api().get('/api/donations').set(auth);
    expect(res.status).toBe(403);
  });

  it('paginates, filters by status and includes donor details', async () => {
    const { auth } = await createAdmin();
    const { user } = await createUser({ name: 'Maria Lopez' });
    for (let i = 0; i < 3; i++) await createDonation(user);
    await createDonation(user, { status: 'pending' });

    const res = await api().get('/api/donations?status=completed&limit=2&page=2').set(auth);

    expect(res.status).toBe(200);
    expect(res.body.donations).toHaveLength(1);
    expect(res.body.donations[0].user).toMatchObject({ name: 'Maria Lopez', email: user.email });
    expect(res.body.pagination).toEqual({ page: 2, limit: 2, total: 3, totalPages: 2 });
  });
});

describe('GET /api/donations/stats', () => {
  it('returns zeros when there are no donations', async () => {
    const res = await api().get('/api/donations/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ totalRaised: 0, donationCount: 0, donorCount: 0, byCategory: [] });
  });

  it('only counts completed donations', async () => {
    const { user: first } = await createUser();
    const { user: second } = await createUser();
    await createDonation(first, { amount: 1000, category: 'education' });
    await createDonation(first, { amount: 3000, category: 'health' });
    await createDonation(second, { amount: 2000, category: 'education' });
    await createDonation(second, { amount: 9900, status: 'pending' });
    await createDonation(second, { amount: 9900, status: 'failed' });

    const res = await api().get('/api/donations/stats');

    expect(res.body).toMatchObject({ totalRaised: 6000, donationCount: 3, donorCount: 2 });
    expect(res.body.byCategory).toEqual([
      { category: 'education', totalRaised: 3000, donationCount: 2 },
      { category: 'health', totalRaised: 3000, donationCount: 1 },
    ]);
  });
});
