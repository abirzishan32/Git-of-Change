// Fills a local database with demo accounts and donations so the dashboards
// have something to show without making real test payments.
//
//   npm run seed
//
// Running it again replaces the previous demo data. Never run it in production.
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { DONATION_CATEGORIES } from '../src/constants/donations.js';
import { Donation } from '../src/models/donation.model.js';
import { User } from '../src/models/user.model.js';

if (env.NODE_ENV === 'production') {
  console.error('Refusing to seed demo data into a production database.');
  process.exit(1);
}

const DEMO_PASSWORD = 'password123';

const DEMO_ADMIN = { name: 'Demo Admin', email: 'admin@example.com', role: 'admin' };
const DEMO_DONORS = [
  { name: 'Nadia Islam', email: 'donor@example.com' },
  { name: 'Ayesha Karim', email: 'ayesha@example.com' },
  { name: 'Daniel Park', email: 'daniel@example.com' },
  { name: 'Maria Lopez', email: 'maria@example.com' },
  { name: 'Tanvir Hasan', email: 'tanvir@example.com' },
  { name: 'Emily Chen', email: 'emily@example.com' },
];

const AMOUNTS = [1000, 1500, 2500, 2500, 5000, 5000, 7500, 10000, 20000];
const DONATION_COUNT = 36;
const DAY_MS = 24 * 60 * 60 * 1000;

// Small seeded PRNG so every run produces the same demo data
function createRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(2025);
const pick = (items) => items[Math.floor(random() * items.length)];

await mongoose.connect(env.MONGO_URI);

try {
  const demoEmails = [DEMO_ADMIN, ...DEMO_DONORS].map((account) => account.email);
  const previousUsers = await User.find({ email: { $in: demoEmails } }, '_id');
  await Donation.deleteMany({
    $or: [{ user: { $in: previousUsers } }, { paymentIntentId: /^seed_/ }],
  });
  await User.deleteMany({ email: { $in: demoEmails } });

  // User.create runs the password-hashing hook; insertMany would skip it
  await User.create({ ...DEMO_ADMIN, password: DEMO_PASSWORD });
  const donors = await Promise.all(
    DEMO_DONORS.map((donor) => User.create({ ...donor, password: DEMO_PASSWORD })),
  );

  const now = Date.now();
  const donations = Array.from({ length: DONATION_COUNT }, (_, index) => {
    const createdAt = new Date(now - Math.floor(random() * 60 * DAY_MS));
    let status = 'completed';
    if (index === 3 || index === 17) status = 'pending';
    if (index === 11) status = 'failed';

    return {
      user: pick(donors)._id,
      amount: pick(AMOUNTS),
      category: pick(DONATION_CATEGORIES),
      status,
      paymentIntentId: `seed_${index}_${Math.floor(random() * 1e9)}`,
      createdAt,
      updatedAt: createdAt,
    };
  });

  await Donation.insertMany(donations, { timestamps: false });

  console.log(`Seeded ${donors.length + 1} users and ${donations.length} donations.\n`);
  console.log('Log in with any of these (password: %s):', DEMO_PASSWORD);
  console.log(`  admin  ${DEMO_ADMIN.email}`);
  console.log(`  donor  ${DEMO_DONORS[0].email}`);
} finally {
  await mongoose.disconnect();
}
