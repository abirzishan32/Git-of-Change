import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./tests/global-setup.js'],
    setupFiles: ['./tests/setup.js'],
    hookTimeout: 120_000,
    env: {
      NODE_ENV: 'test',
      // The real connection string comes from the in-memory server in global-setup.js
      MONGO_URI: 'mongodb://in-memory',
      JWT_SECRET: 'test-only-jwt-secret-that-is-long-enough',
      STRIPE_SECRET_KEY: 'sk_test_not_a_real_key',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_secret',
    },
  },
});
