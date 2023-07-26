import 'express-async-errors';
import Router from 'express';
const router = Router();

router.get('/test_try/error', async (request, response, next) => {
  try {
    const result = await getID();
    console.log('result: ', result);
  } catch (err) {
    console.log(err);
    let customError = {
      message: err,
    };
    next(customError);
  }

  try {
    const result = await getName();
    console.log('result: ', result);
  } catch (err) {
    console.log(err);
    let customError = {
      message: err,
    };
    next(customError);
  }
});

const getID = async () => {
  return new Promise((res, rej) => {
    rej('Get ID Failed!');
  });
};

const getName = async () => {
  return new Promise((res, rej) => {
    rej('Get Name Failed!');
  });
};

export default router;
