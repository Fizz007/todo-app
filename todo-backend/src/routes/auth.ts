import { Router } from 'express';
import { signup, login, logout, refreshToken, getMe } from '../controllers/authController';
import { verifyAccessToken, verifyRefreshToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', verifyAccessToken, logout);
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.get('/me', verifyAccessToken, getMe);

export default router; 