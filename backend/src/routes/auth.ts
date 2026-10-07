import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { db } from '../config/database';
import { validate } from '../middleware/validate';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

router.post('/register',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate,
  (req, res, next) => {
    try {
      const { name, email, password, ageRange, goal } = req.body;
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) {
        return res.status(409).json({
          timestamp: new Date().toISOString(),
          status: 409,
          code: 'CONFLICT',
          message: 'An account with this email already exists',
          fieldErrors: [{ field: 'email', message: 'Email already in use' }]
        });
      }

      const hash = bcrypt.hashSync(password, 10);
      const createdAt = new Date().toISOString();
      const result = db.prepare(
        'INSERT INTO users (name, email, password, ageRange, goal, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(name, email, hash, ageRange || null, goal || null, createdAt);
      
      const userId = String(result.lastInsertRowid);
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
      
      res.status(201).json({
        user: { id: userId, name, email, ageRange: ageRange || null, goal: goal || null, createdAt },
        token
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/login',
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
  (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          timestamp: new Date().toISOString(),
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
          fieldErrors: []
        });
      }

      const token = jwt.sign({ userId: String(user.id) }, JWT_SECRET, { expiresIn: '7d' });
      res.json({
        user: {
          id: String(user.id),
          name: user.name,
          email: user.email,
          ageRange: user.ageRange || null,
          goal: user.goal || null,
          createdAt: user.createdAt || new Date().toISOString()
        },
        token
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
