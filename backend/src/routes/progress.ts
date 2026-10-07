import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();
router.use(authenticate);

router.get('/', (req: AuthRequest, res, next) => {
  try {
    const range = req.query.range as string || '30d';
    const includeDemos = req.query.includeDemos === 'true';

    let days = 30;
    if (range === '7d') days = 7;
    else if (range === '90d') days = 90;

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    const dateStr = dateLimit.toISOString();

    let query = 'SELECT * FROM sessions WHERE userId = ? AND startedAt >= ?';
    const params: any[] = [req.userId, dateStr];

    if (!includeDemos) {
      query += " AND source != 'demo'";
    }

    const sessions = db.prepare(query).all(...params) as any[];

    const totalSessions = sessions.length;
    const totalReps = sessions.reduce((acc, s) => acc + s.totalReps, 0);
    const avgScore = totalSessions > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.formScore, 0) / totalSessions) : 0;
    const bestScore = totalSessions > 0 ? Math.max(...sessions.map(s => s.formScore)) : 0;
    
    // Simple streak calculation (simplified for this exercise)
    const streak = 0; 

    res.json({
      totalSessions,
      totalReps,
      averageScore: avgScore,
      bestScore,
      streak,
      sessionsOverTime: sessions.map(s => ({ date: s.startedAt, score: s.formScore })),
    });

  } catch (err) {
    next(err);
  }
});

export default router;
