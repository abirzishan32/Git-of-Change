import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { signToken } from '../utils/token.js';

function authResponse(user) {
  return { token: signToken(user), user };
}

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.valid.body;

  if (await User.exists({ email })) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.valid.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  res.json(authResponse(user));
}

// GET /api/auth/me
export function getMe(req, res) {
  res.json({ user: req.user });
}

// PATCH /api/auth/me
export async function updateMe(req, res) {
  const { name, email, currentPassword, newPassword } = req.valid.body;
  const user = await User.findById(req.user.id).select('+password');

  const emailChanged = email !== undefined && email !== user.email;

  // Changing sign-in details requires proving you own the account
  if (emailChanged || newPassword) {
    if (!currentPassword || !(await user.comparePassword(currentPassword))) {
      throw new ApiError(400, 'Your current password is incorrect', [
        { field: 'currentPassword', message: 'Your current password is incorrect' },
      ]);
    }
  }

  if (emailChanged) {
    if (await User.exists({ email })) {
      throw new ApiError(409, 'An account with this email already exists');
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (newPassword) user.password = newPassword;

  await user.save();
  res.json({ user });
}
