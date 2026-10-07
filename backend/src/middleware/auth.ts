import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 401, message: 'Unauthorized', timestamp: new Date().toISOString() });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ status: 401, message: 'Invalid token', timestamp: new Date().toISOString() });
  }
};
