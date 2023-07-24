import crypto from 'crypto';

// 生成 4 位验证码
const generateCode = (): string => {
  const bytes = crypto.randomBytes(4);
  return bytes.toString('hex').toUpperCase();
};

export default generateCode;
