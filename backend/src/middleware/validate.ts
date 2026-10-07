import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : err.type,
      message: err.msg
    }));
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      fieldErrors
    });
  }
  next();
};
