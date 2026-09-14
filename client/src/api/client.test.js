import { AxiosError } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getToken, setToken } from '../lib/token';
import { api, onUnauthorized } from './client';

function respondWith(status, data) {
  api.defaults.adapter = async (config) => {
    const response = { status, data, headers: {}, config, statusText: '' };
    throw new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, response);
  };
}

describe('api client', () => {
  afterEach(() => {
    delete api.defaults.adapter;
  });

  it('attaches the stored token to requests', async () => {
    setToken('abc.def.ghi');
    let authorization;
    api.defaults.adapter = async (config) => {
      authorization = config.headers.Authorization;
      return { status: 200, data: {}, headers: {}, config, statusText: 'OK' };
    };

    await api.get('/api/auth/me');

    expect(authorization).toBe('Bearer abc.def.ghi');
  });

  it('leaves a failed login alone so the form can show the error', async () => {
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    respondWith(401, { message: 'Invalid email or password' });

    await expect(api.post('/api/auth/login', {})).rejects.toMatchObject({
      response: { data: { message: 'Invalid email or password' } },
    });
    expect(listener).not.toHaveBeenCalled();

    unsubscribe();
  });

  it('ends the session when an authenticated request is rejected', async () => {
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    setToken('expired.token');
    respondWith(401, { message: 'Your session has expired. Please log in again.' });

    await expect(api.get('/api/donations/me')).rejects.toBeInstanceOf(AxiosError);

    expect(listener).toHaveBeenCalledOnce();
    expect(getToken()).toBeNull();

    unsubscribe();
  });
});
