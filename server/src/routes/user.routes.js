import { Router } from 'express';
import { deleteUser, getUser, listUsers } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { objectIdParamsSchema, paginationSchema } from '../validators/common.schemas.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/', validate(paginationSchema, 'query'), listUsers);
router.get('/:id', validate(objectIdParamsSchema, 'params'), getUser);
router.delete('/:id', validate(objectIdParamsSchema, 'params'), deleteUser);

export default router;
