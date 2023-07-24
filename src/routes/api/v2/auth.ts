import Router from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../../db/prisma';
import { PasswordUtil } from '../../../utils/password-util';
import { JWT_SECRET } from '../../../jwt/constant';

const router = Router();

// POST 请求
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const ip = req.ip || '';

  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: 'username or password or email is error',
    });
  }

  // 检查用户名和邮箱是否已存在
  // findFirst：返回第一个匹配您的条件的记录
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: 'Username or email already exists' });
  }

  // 创建新用户
  const hashedPassword = await PasswordUtil.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      email,
      ip,
    },
    select: {
      id: true,
      username: true,
      email: true,
      ip: true,
    },
  });

  // 创建 JWT token 并返回给客户端
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
  res.json({ success: true, message: 'success', token });
});

export default router;
