import { logger } from './logger.js';

export const errorHandler = (err, _req, res, _next) => {
  logger.error(err.message, { stack: err.stack?.split('\n')[1]?.trim() });

  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
    },
  });
};

export const asyncWrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
