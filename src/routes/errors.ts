import Router from 'express';
import {
  BadRequestError,
  CustomAPIError,
  UnauthenticatedError,
} from '../errors';
const router = Router();

router.get('/error/400', (request, response, next) => {
  const err = new BadRequestError();
  next(err);
});

router.get('/error/401', (request, response, next) => {
  const err = new UnauthenticatedError();
  next(err);
});

router.get('/error/:status', (request, response, next) => {
  const { status } = request.params;
  const err = new CustomAPIError('', Number(status));
  next(err);
});

export default router;
