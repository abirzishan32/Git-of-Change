import { z } from 'zod';

const nameSchema = z
  .string({ error: 'Name is required' })
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(60, 'Name must be at most 60 characters');

const emailSchema = z
  .string({ error: 'Email is required' })
  .trim()
  .toLowerCase()
  .pipe(z.email('Please enter a valid email address'));

// bcrypt only uses the first 72 bytes of a password
const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
});

export const updateMeSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    currentPassword: z.string().optional(),
    newPassword: passwordSchema.optional(),
  })
  .refine((data) => data.name || data.email || data.newPassword, {
    error: 'Nothing to update',
  });
