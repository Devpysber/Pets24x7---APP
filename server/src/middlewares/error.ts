import { Request, Response, NextFunction } from 'express';
import { trackError } from '../utils/errorTracking.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Track error for production monitoring
  trackError(err, {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: (req as any).user?.id,
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
};
