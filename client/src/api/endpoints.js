import { api } from './client';

export const authApi = {
  register: (details) => api.post('/api/auth/register', details).then((res) => res.data),
  login: (credentials) => api.post('/api/auth/login', credentials).then((res) => res.data),
  getMe: () => api.get('/api/auth/me').then((res) => res.data),
  updateMe: (changes) => api.patch('/api/auth/me', changes).then((res) => res.data),
};

export const donationsApi = {
  createPaymentIntent: ({ amount, category }) =>
    api.post('/api/donations/payment-intent', { amount, category }).then((res) => res.data),
  syncPaymentIntent: (paymentIntentId) =>
    api
      .post(`/api/donations/payment-intent/${encodeURIComponent(paymentIntentId)}/sync`)
      .then((res) => res.data),
};

export const usersApi = {
  remove: (id) => api.delete(`/api/users/${encodeURIComponent(id)}`),
};
