import { MongoMemoryServer } from 'mongodb-memory-server';

// One throwaway MongoDB for the whole run; each test file gets its own database.
export default async function setup(project) {
  const mongod = await MongoMemoryServer.create();
  project.provide('mongoUri', mongod.getUri());

  return async () => {
    await mongod.stop();
  };
}
