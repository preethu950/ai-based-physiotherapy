import { Router } from 'express';
import { db } from '../config/database';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const exercises = db.prepare('SELECT * FROM exercises').all().map((ex: any) => ({
      ...ex,
      instructions: JSON.parse(ex.instructions),
      commonMistakes: JSON.parse(ex.commonMistakes),
      hasAnalyzer: ex.hasAnalyzer === 1
    }));
    res.json(exercises);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const ex = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id) as any;
    if (!ex) {
      return res.status(404).json({
        timestamp: new Date().toISOString(),
        status: 404,
        code: 'NOT_FOUND',
        message: 'Exercise not found'
      });
    }
    res.json({
      ...ex,
      instructions: JSON.parse(ex.instructions),
      commonMistakes: JSON.parse(ex.commonMistakes),
      hasAnalyzer: ex.hasAnalyzer === 1
    });
  } catch (err) {
    next(err);
  }
});

export default router;
