import { Router } from 'express';
import { signup, login, logout, refreshToken } from '../controllers/authController';
import { verifyAccessToken, verifyRefreshToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', verifyAccessToken, logout);
router.post('/refresh-token', verifyRefreshToken, refreshToken);

export default router; 