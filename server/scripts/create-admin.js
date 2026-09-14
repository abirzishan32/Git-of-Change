// Creates an admin account, or promotes an existing user to admin.
//
//   npm run create-admin -- --email jane@example.com --name "Jane Doe" --password "a-long-password"
//   npm run create-admin -- --email existing-user@example.com
import mongoose from 'mongoose';
import { parseArgs } from 'node:util';
import { env } from '../src/config/env.js';
import { User } from '../src/models/user.model.js';
import { registerSchema } from '../src/validators/auth.schemas.js';

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
  },
});

if (!values.email) {
  console.error(
    'Usage: npm run create-admin -- --email <email> [--name <name> --password <password>]',
  );
  process.exit(1);
}

await mongoose.connect(env.MONGO_URI);

try {
  const existing = await User.findOne({ email: values.email.trim().toLowerCase() });

  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log(`${existing.email} is now an admin.`);
  } else {
    const result = registerSchema.safeParse(values);
    if (!result.success) {
      console.error('No user with that email exists. To create one, provide valid details:');
      for (const issue of result.error.issues) console.error(`  - ${issue.message}`);
      process.exitCode = 1;
    } else {
      const admin = await User.create({ ...result.data, role: 'admin' });
      console.log(`Created admin account for ${admin.email}.`);
    }
  }
} finally {
  await mongoose.disconnect();
}
