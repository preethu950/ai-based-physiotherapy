import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/me', authenticate, (req: AuthRequest, res, next) => {
  try {
    const user = db.prepare('SELECT id, name, email, ageRange, goal, createdAt FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      return res.status(404).json({
        timestamp: new Date().toISOString(),
        status: 404,
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }
    res.json({ ...user, id: String(user.id), createdAt: user.createdAt || new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

export default router;
