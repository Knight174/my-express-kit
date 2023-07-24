// 引入 Winston 模块
import { createLogger, format, transports } from 'winston';
// 引入 path 模块
import path from 'path';

// 获取 Winston 的格式化方法
const { combine, timestamp, align, printf } = format;
// 自定义日志输出格式
const myFormat = printf(({ level, message, timestamp }) => {
  return `${level}: ${timestamp} ${message}`;
});

// 创建一个 Winston logger 实例
const logger = createLogger({
  // 定义日志格式，这里使用了多个格式化方法
  format: combine(
    timestamp(), // 增加时间戳
    align(), // 对齐日志输出
    format.json(), // 将日志信息转换为 JSON 格式
    myFormat // 使用自定义日志输出格式（会覆盖上面的 json 格式
  ),
  // 定义日志输出方式，这里只输出到文件中
  transports: [
    new transports.File({
      // 定义日志文件的路径和文件名
      filename: path.join(__dirname, '../logs/error.log'),
      // 定义日志输出的最小级别
      level: 'error',
    }),
    new transports.File({
      // 定义日志文件的路径和文件名
      filename: path.join(__dirname, '../logs/warn.log'),
      // 定义日志输出的最小级别
      level: 'warn',
    }),
  ],
});

// 导出 logger 实例
export default logger;
