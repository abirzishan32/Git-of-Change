import mongoose from 'mongoose';
import { createApp } from './app.js';
import { env } from './config/env.js';

try {
  await mongoose.connect(env.MONGO_URI);
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('Could not connect to MongoDB:', err.message);
  process.exit(1);
}

if (!env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set: donations are disabled.');
}

const server = createApp().listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close();
  await mongoose.disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
