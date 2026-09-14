import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { afterAll, afterEach, beforeAll, inject } from 'vitest';

beforeAll(async () => {
  await mongoose.connect(inject('mongoUri'), { dbName: `test-${randomUUID()}` });
  await mongoose.syncIndexes();
});

afterEach(async () => {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
