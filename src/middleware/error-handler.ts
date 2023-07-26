import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

interface Error {
  statusCode: number;
  message: string;
}

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const errorResponse: Error = {
    message,
    statusCode,
  };

  res.status(statusCode).json({ error: errorResponse });
};

export default errorHandler;
