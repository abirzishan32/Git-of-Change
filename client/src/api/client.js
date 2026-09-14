import axios from 'axios';
import { clearToken, getToken } from '../lib/token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unauthorizedListeners = new Set();

/** Subscribe to "the session expired". Returns an unsubscribe function. */
export function onUnauthorized(listener) {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

api.interceptors.response.use(undefined, (error) => {
  // Only a request that was sent *with* a token can mean an expired session.
  // A failed login has no token, so its error reaches the form untouched.
  if (error.response?.status === 401 && error.config?.headers?.Authorization) {
    clearToken();
    unauthorizedListeners.forEach((listener) => listener());
  }
  return Promise.reject(error);
});
