import { expressjwt as jwt } from 'express-jwt';
import { JWT_SECRET } from '../config/constant';

export default jwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'], // 加密算法
}).unless({
  path: [
    '/api/v2/auth/login',
    '/api/v2/auth/register',
    '/api/v2/auth/verification_code',
    /^\/public\/.*/,
  ], // 不需要校验 token 的 api
});
