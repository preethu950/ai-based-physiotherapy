import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { db } from '../config/database';
import { LocalRuleBasedAssistant } from '../services/assistantService';

const router = Router();
router.use(authenticate);

router.get('/summary', (req: AuthRequest, res, next) => {
  try {
    const sessions = db.prepare('SELECT formScore FROM sessions WHERE userId = ?').all(req.userId);
    const summary = LocalRuleBasedAssistant.getSummary(sessions);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
});

router.post('/ask',
  body('question').notEmpty().withMessage('Question is required'),
  validate,
  (req: AuthRequest, res, next) => {
    try {
      const sessions = db.prepare('SELECT formScore FROM sessions WHERE userId = ?').all(req.userId);
      const answer = LocalRuleBasedAssistant.answerQuestion(req.body.question, sessions);
      res.json({ answer });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
