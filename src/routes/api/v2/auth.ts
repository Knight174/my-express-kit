import Router from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../../config/db/prisma';
import { JWT_SECRET } from '../../../config/constant';
import { PasswordUtil } from '../../../utils/password-util';
import sendVerificationEmail from '../../../utils/send_email-util';
import generateVerificationCode from '../../../utils/verification_code-util';
import {
  sendSuccessResponse,
  sendErrorResponse,
  handlePrismaError,
} from '../../../utils/response-util';

const router = Router();

// 注册
router.post('/register', async (req, res) => {
  const { username, password, email, code } = req.body;
  const ip = req.ip || '';

  // 检查 body 参数
  if (!username || !password || !email) {
    return sendErrorResponse(res, 400, 'no username or password or email');
  }
  if (!code) {
    return sendErrorResponse(res, 400, 'no verification code');
  }

  try {
    // 检查用户发送的 code 和数据库中 email 对应的 code 是否一致
    const codeInDB = await prisma.verificationCode.findUnique({
      where: {
        email,
      },
    });
    // 如果不一致，返回错误响应
    if (!codeInDB) {
      return sendErrorResponse(res, 400, 'verification code error');
    }
    // 检查过期时间 5 分钟
    const currentTime = new Date();
    const createdAt = codeInDB.createdAt;
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    const expirationTime = 5 * 60 * 1000; // 5分钟的有效期，以毫秒为单位
    if (timeDifference > expirationTime) {
      // 验证码已过期
      return sendErrorResponse(res, 400, '请重新发送验证码');
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return sendErrorResponse(res, 400, 'Username or email already exists');
    }

    // 生成 hash 密码
    const hashedPassword = await PasswordUtil.hash(password, 10);
    // 创建新用户
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

    if (newUser) {
      // 如果注册成功，删除验证码数据库中的对应字段
      await prisma.verificationCode.delete({
        where: {
          email,
        },
      });

      // 创建 JWT token 并返回给客户端
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
      sendSuccessResponse(res, '注册成功', {
        token,
      });
    }
  } catch (err) {
    return handlePrismaError(res, err);
  }
});

// 登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendErrorResponse(res, 400, 'no username or password');
  }

  try {
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
      return sendErrorResponse(res, 400, 'Invalid username or password');
    }

    // 比较密码
    const passwordMatch = await PasswordUtil.compare(password, user.password);
    if (!passwordMatch) {
      return sendErrorResponse(res, 400, 'Invalid username or password');
    }

    // 创建 JWT token 并返回给客户端
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    sendSuccessResponse(res, '登录成功', {
      token,
    });
  } catch (err) {
    return handlePrismaError(res, err);
  }
});

// 发送邮箱验证码
// 1. 保存验证码到数据库
// 2. 发送验证码到用户邮箱
// 发送邮箱验证码
router.post('/verification_code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendErrorResponse(res, 400, 'invalid email');
  }

  // 检查邮箱是否已存在于用户表中
  const existingUser = await prisma.user.findFirst({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return sendErrorResponse(res, 400, 'Email already exists');
  }

  const code = generateVerificationCode(); // 生成验证码

  try {
    // 将验证码保存到 verificationCode 表
    await prisma.verificationCode.create({
      data: {
        code,
        email,
      },
    });

    // 发送验证码到用户邮箱
    await sendVerificationCodeEmail(email, code);

    sendSuccessResponse(res, '发送验证码成功');
  } catch (error) {
    // 发送失败，从表中删除验证码
    await prisma.verificationCode.delete({
      where: { email },
    });

    return sendErrorResponse(
      res,
      500,
      'Failed to send verification code email'
    );
  }
});

const sendVerificationCodeEmail = async (email: string, code: string) => {
  try {
    // 将验证码发送到邮箱
    await sendVerificationEmail(email, code);
  } catch (error) {
    // 发送失败，抛出错误
    throw new Error('Failed to send verification code email.');
  }
};

export default router;
