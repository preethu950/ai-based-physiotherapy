import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();
router.use(authenticate);

router.get('/', (req: AuthRequest, res, next) => {
  try {
    const sessions = db.prepare('SELECT * FROM sessions WHERE userId = ? ORDER BY startedAt DESC').all(req.userId) as any[];

    const totalSessions = sessions.length;
    const totalReps = sessions.reduce((acc, s) => acc + s.totalReps, 0);
    const avgScore = totalSessions > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.formScore, 0) / totalSessions) : 0;

    const recentSessions = sessions.slice(0, 5).map(s => ({
      ...s,
      componentScores: JSON.parse(s.componentScores),
      reps: JSON.parse(s.reps),
      feedbackSummary: JSON.parse(s.feedbackSummary),
      rangeOfMotion: JSON.parse(s.rangeOfMotion),
      completed: s.completed === 1
    }));

    res.json({
      totalSessions,
      totalReps,
      averageFormScore: avgScore,
      currentStreak: 0,
      recentSessions,
      recommendedExercises: [], // simplified
      formScoreChart: [],
      weeklyActivity: []
    });
  } catch (err) {
    next(err);
  }
});

export default router;
