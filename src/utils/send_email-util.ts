import nodemailer from 'nodemailer';

async function sendVerificationEmail(
  email: string,
  code: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    // 发件人设置
    auth: {
      user: process.env.EMAIL_USER, // 邮箱账号
      pass: process.env.EMAIL_PASS, // 邮箱的授权码
    },
  });

  const options = {
    from: `"Eric" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Hello, node mail',
    text: `您的验证码是：${code}`,
  };

  await transporter.sendMail(options, (err, msg) => {
    if (err) {
      throw err;
    } else {
      transporter.close();
    }
  });
}

export default sendVerificationEmail;
