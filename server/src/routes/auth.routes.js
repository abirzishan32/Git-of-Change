import { Router } from 'express';
import { getMe, login, register, updateMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rate-limit.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema, updateMeSchema } from '../validators/auth.schemas.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, validate(updateMeSchema), updateMe);

export default router;
