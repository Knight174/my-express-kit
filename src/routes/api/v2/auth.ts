import Router from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../../config/prisma';
import { PasswordUtil } from '../../../utils/password-util';
import { JWT_SECRET } from '../../../config/jwt';
import sendVerificationEmail from '../../../utils/send_email-util';
import generateCode from '../../../utils/verification_code-util';

const router = Router();

// 注册
router.post('/register', async (req, res) => {
  const { username, password, email, code } = req.body;
  const ip = req.ip || '';

  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: 'username or password or email is error',
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'no verification code',
    });
  }

  // 检查用户发送的 code 和数据库中 email 对应的 code 是否一致
  try {
    const codeInDB = await prisma.verificationCode.findFirst({
      where: {
        email,
      },
    });
    if (!codeInDB) {
      return res.status(400).json({ success: false, message: '验证码错误！' });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: '服务器错误',
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

  // 如果注册成功，删除验证码数据库中的对应字段
  await prisma.verificationCode.delete({
    where: {
      email,
    },
  });

  // 创建 JWT token 并返回给客户端
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
  res.json({ success: true, message: '注册成功', token });
});

// 登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'username or password is error',
    });
  }

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid username or password' });
  }

  // 比较密码
  const passwordMatch = await PasswordUtil.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid username or password' });
  }

  // 创建 JWT token 并返回给客户端
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ success: true, message: '登录成功', token });
});

// 发送邮箱验证码
// 1. 保存验证码到数据库
// 2. 发送验证码到用户邮箱
router.post('/verification_code', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'no found email' });
  }
  const code = generateCode();
  try {
    // 先将验证码和邮箱保存到 verificationCode 表
    await prisma.verificationCode.create({
      data: {
        code,
        email,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: '发送验证码失败!' });
  }

  try {
    // 将验证码发送到邮箱
    await sendVerificationEmail(email, code);
  } catch (e) {
    // 如果邮件服务发送失败，那么从表中把 email 删除
    const existingEmail = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
      select: {
        id: true,
      },
    });
    if (existingEmail) {
      await prisma.verificationCode.delete({
        where: {
          email,
        },
      });
    }
    return res.status(500).json({ success: false, message: '发送验证码失败!' });
  }

  res.json({ success: true, message: '发送验证码成功!' });
});

export default router;
