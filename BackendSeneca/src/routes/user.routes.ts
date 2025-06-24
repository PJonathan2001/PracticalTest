import { Router } from 'express';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { updateProfileValidation, validate } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/me', authMiddleware, asyncHandler(UserController.getProfile));
router.put('/me', authMiddleware, updateProfileValidation, validate, asyncHandler(UserController.updateProfile));
router.get('/login-history', authMiddleware, asyncHandler(UserController.getLoginHistory));

export default router; 