// import morgan from 'morgan';
// import fs from 'fs';
// import path from 'path';
// import { Request, Response, NextFunction } from 'express';

// // 创建日志文件夹
// const logsDir = path.join(__dirname, '..', 'logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// // 创建日志文件流
// const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), {
//   flags: 'a',
// });

// 创建记录 HTTP 请求日志的中间件
// let loggerMiddleware = morgan('combined', {
//   stream: accessLogStream, // 将日志输出到文件
// });

// const loggerMiddleware = morgan();

// 在控制台中输出日志
// morgan.token('console', (req: Request, res: Response) => {
//   return JSON.stringify({
//     method: req.method,
//     url: req.url,
//     status: res.statusCode,
//     'response-time': `${res.getHeader('X-Response-Time')}ms`,
//   });
// });
// morgan.format(
//   'combined',
//   ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :console :res[content-length] ":referrer" ":user-agent"'
// );

// export default morgan('short', {
//   stream: accessLogStream, // 将日志输出到文件
// });
