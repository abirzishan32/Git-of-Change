import { describe, expect, it } from 'vitest';
import { User } from '../src/models/user.model.js';
import { api, createUser } from './helpers.js';

const validSignup = { name: 'Jane Donor', email: 'Jane@Example.com', password: 'password123' };

describe('POST /api/auth/register', () => {
  it('creates a donor account and returns a token', async () => {
    const res = await api().post('/api/auth/register').send(validSignup);

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({
      name: 'Jane Donor',
      email: 'jane@example.com',
      role: 'user',
    });
    expect(res.body.user).not.toHaveProperty('password');

    const stored = await User.findOne({ email: 'jane@example.com' }).select('+password');
    expect(stored.password).not.toBe(validSignup.password);
  });

  it('never lets someone register themselves as an admin', async () => {
    const res = await api()
      .post('/api/auth/register')
      .send({ ...validSignup, role: 'admin', adminInviteToken: 'guess' });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('user');
  });

  it('rejects an email that is already registered, ignoring case', async () => {
    await createUser({ email: 'jane@example.com' });

    const res = await api().post('/api/auth/register').send(validSignup);

    expect(res.status).toBe(409);
  });

  it.each([
    [{ ...validSignup, email: 'not-an-email' }, /valid email/],
    [{ ...validSignup, password: 'short' }, /at least 8/],
    [{ email: 'jane@example.com', password: 'password123' }, /name is required/i],
  ])('validates the request body (%#)', async (body, message) => {
    const res = await api().post('/api/auth/register').send(body);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(message);
  });
});

describe('POST /api/auth/login', () => {
  it('returns a token for valid credentials', async () => {
    await createUser({ email: 'donor@example.com', password: 'password123' });

    const res = await api()
      .post('/api/auth/login')
      .send({ email: ' DONOR@example.com ', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe('donor@example.com');
  });

  it('rejects a wrong password with a JSON message', async () => {
    await createUser({ email: 'donor@example.com' });

    const res = await api()
      .post('/api/auth/login')
      .send({ email: 'donor@example.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});

describe('/api/auth/me', () => {
  it('requires a token', async () => {
    const res = await api().get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a tampered token', async () => {
    const { token } = await createUser();
    const res = await api()
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token.slice(0, -2)}xx`);
    expect(res.status).toBe(401);
  });

  it('rejects the token of a deleted account', async () => {
    const { user, auth } = await createUser();
    await user.deleteOne();

    const res = await api().get('/api/auth/me').set(auth);

    expect(res.status).toBe(401);
  });

  it('returns the signed-in user', async () => {
    const { user, auth } = await createUser();

    const res = await api().get('/api/auth/me').set(auth);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ _id: user.id, email: user.email });
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('updates the name without asking for the password', async () => {
    const { auth } = await createUser();

    const res = await api().patch('/api/auth/me').set(auth).send({ name: 'New Name' });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('New Name');
  });

  it('requires the current password to change the password', async () => {
    const { user, auth } = await createUser({ password: 'password123' });

    const rejected = await api()
      .patch('/api/auth/me')
      .set(auth)
      .send({ newPassword: 'new-password-456', currentPassword: 'wrong-password' });
    expect(rejected.status).toBe(400);

    const accepted = await api()
      .patch('/api/auth/me')
      .set(auth)
      .send({ newPassword: 'new-password-456', currentPassword: 'password123' });
    expect(accepted.status).toBe(200);

    const login = await api()
      .post('/api/auth/login')
      .send({ email: user.email, password: 'new-password-456' });
    expect(login.status).toBe(200);
  });
});
