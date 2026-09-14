import { describe, expect, it } from 'vitest';
import { User } from '../src/models/user.model.js';
import { api, createAdmin, createDonation, createUser } from './helpers.js';

describe('/api/users access control', () => {
  it('requires authentication', async () => {
    const res = await api().get('/api/users');
    expect(res.status).toBe(401);
  });

  it("doesn't let donors look up other accounts", async () => {
    const { auth } = await createUser();
    const { user: other } = await createUser();

    const list = await api().get('/api/users').set(auth);
    const single = await api().get(`/api/users/${other.id}`).set(auth);

    expect(list.status).toBe(403);
    expect(single.status).toBe(403);
  });
});

describe('GET /api/users', () => {
  it('lists users with how much each has donated', async () => {
    const { auth } = await createAdmin();
    const { user } = await createUser({ name: 'Daniel Park' });
    await createDonation(user, { amount: 1000 });
    await createDonation(user, { amount: 4000 });
    await createDonation(user, { amount: 9900, status: 'failed' });

    const res = await api().get('/api/users').set(auth);

    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBe(2);
    const daniel = res.body.users.find((entry) => entry.name === 'Daniel Park');
    expect(daniel).toMatchObject({ totalDonated: 5000, donationCount: 2 });
    expect(daniel).not.toHaveProperty('password');
  });
});

describe('GET /api/users/:id', () => {
  it('returns 400 for a malformed id and 404 for an unknown one', async () => {
    const { auth } = await createAdmin();

    const malformed = await api().get('/api/users/123').set(auth);
    const unknown = await api().get('/api/users/64b7f0f0f0f0f0f0f0f0f0f0').set(auth);

    expect(malformed.status).toBe(400);
    expect(unknown.status).toBe(404);
  });
});

describe('DELETE /api/users/:id', () => {
  it('deletes a donor account', async () => {
    const { auth } = await createAdmin();
    const { user } = await createUser();

    const res = await api().delete(`/api/users/${user.id}`).set(auth);

    expect(res.status).toBe(204);
    expect(await User.exists({ _id: user._id })).toBeNull();
  });

  it('refuses to delete the signed-in admin or another admin', async () => {
    const { user: admin, auth } = await createAdmin();
    const { user: otherAdmin } = await createAdmin();

    const self = await api().delete(`/api/users/${admin.id}`).set(auth);
    const other = await api().delete(`/api/users/${otherAdmin.id}`).set(auth);

    expect(self.status).toBe(400);
    expect(other.status).toBe(400);
    expect(await User.countDocuments()).toBe(2);
  });

  it('returns 404 for an unknown user', async () => {
    const { auth } = await createAdmin();

    const res = await api().delete('/api/users/64b7f0f0f0f0f0f0f0f0f0f0').set(auth);

    expect(res.status).toBe(404);
  });
});
