import { describe, expect, it } from 'vitest';
import { api } from './helpers.js';

describe('app', () => {
  it('reports health', async () => {
    const res = await api().get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('answers unknown routes with a JSON 404', async () => {
    const res = await api().get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/route not found/i);
  });

  it('answers malformed JSON with a JSON 400 instead of an HTML stack trace', async () => {
    const res = await api()
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": ');

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.text).not.toMatch(/at .*\.js/);
  });
});
