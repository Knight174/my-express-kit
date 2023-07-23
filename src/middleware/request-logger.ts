import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// 创建日志文件夹
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 创建日志文件流
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), {
  flags: 'a',
});

export default morgan('combined', { stream: accessLogStream });
