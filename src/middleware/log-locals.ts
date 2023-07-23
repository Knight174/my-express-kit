import { Request, Response, NextFunction } from 'express';

const logLocals = (req: Request, res: Response, next: NextFunction) => {
  const title = res.app.locals.title;
  console.log('app.locals.title => ', title);
  next();
};

export default logLocals;
