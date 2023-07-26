import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import logger from './other-logger';
import { CustomAPIError } from '../errors';

interface Error {
  statusCode: number;
  message: string;
  name?: string;
  status?: string;
}

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err); // 日志记录

  // 权限校验
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: {
        statusCode: err.status,
        message: err.message.trim(),
      },
    });
  } else {
    next();
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const errorResponse: Error = {
    message,
    statusCode,
  };

  res.status(statusCode).json({ error: errorResponse });
};

export default errorHandler;
