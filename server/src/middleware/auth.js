import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { verifyToken } from '../utils/token.js';

export async function requireAuth(req, _res, next) {
  const [scheme, token] = req.get('authorization')?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  // The account may have been deleted after the token was issued
  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  req.user = user;
  next();
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }
    next();
  };
}
