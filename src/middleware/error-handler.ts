import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

interface Error {
  status: number;
  message: string;
}

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const errorResponse: Error = {
    message,
    status,
  };

  res.status(status).json({ error: errorResponse });
};

export default errorHandler;
