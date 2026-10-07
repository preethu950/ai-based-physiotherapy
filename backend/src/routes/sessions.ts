import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { db } from '../config/database';

const router = Router();
router.use(authenticate);

router.post('/',
  body('exerciseId').notEmpty(),
  body('startedAt').isISO8601(),
  body('durationSeconds').isInt({ min: 0 }),
  body('totalReps').isInt({ min: 0 }),
  body('correctReps').isInt({ min: 0 }),
  body('incompleteReps').isInt({ min: 0 }),
  body('formScore').isInt({ min: 0, max: 100 }),
  body('source').isIn(['camera', 'demo']),
  body('completed').isBoolean(),
  validate,
  (req: AuthRequest, res, next) => {
    try {
      const { exerciseId, startedAt, durationSeconds, totalReps, correctReps, incompleteReps, formScore, componentScores, reps, feedbackSummary, rangeOfMotion, source, completed } = req.body;
      
      const result = db.prepare(`
        INSERT INTO sessions (userId, exerciseId, startedAt, durationSeconds, totalReps, correctReps, incompleteReps, formScore, componentScores, reps, feedbackSummary, rangeOfMotion, source, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        req.userId, exerciseId, startedAt, durationSeconds, totalReps, correctReps, incompleteReps, formScore,
        JSON.stringify(componentScores || {}),
        JSON.stringify(reps || []),
        JSON.stringify(feedbackSummary || []),
        JSON.stringify(rangeOfMotion || {}),
        source,
        completed ? 1 : 0
      );

      res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', (req: AuthRequest, res, next) => {
  try {
    const sessions = db.prepare('SELECT * FROM sessions WHERE userId = ? ORDER BY startedAt DESC').all(req.userId).map((s: any) => ({
      ...s,
      componentScores: JSON.parse(s.componentScores),
      reps: JSON.parse(s.reps),
      feedbackSummary: JSON.parse(s.feedbackSummary),
      rangeOfMotion: JSON.parse(s.rangeOfMotion),
      completed: s.completed === 1
    }));
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req: AuthRequest, res, next) => {
  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ? AND userId = ?').get(req.params.id, req.userId) as any;
    if (!session) {
      return res.status(404).json({
        timestamp: new Date().toISOString(),
        status: 404,
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }
    res.json({
      ...session,
      componentScores: JSON.parse(session.componentScores),
      reps: JSON.parse(session.reps),
      feedbackSummary: JSON.parse(session.feedbackSummary),
      rangeOfMotion: JSON.parse(session.rangeOfMotion),
      completed: session.completed === 1
    });
  } catch (err) {
    next(err);
  }
});

export default router;
