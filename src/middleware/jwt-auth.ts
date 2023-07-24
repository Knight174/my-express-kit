import { expressjwt as jwt } from 'express-jwt';
import { JWT_SECRET } from '../jwt/constant';

export default jwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'], // 加密算法
}).unless({
  path: ['/api/v2/login', '/api/v2/register'], // 不需要校验 token 的 api
});
