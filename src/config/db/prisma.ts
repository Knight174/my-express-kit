import { PrismaClient } from '@prisma/client';
import logger from '../../middleware/other-logger';

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: [
    { level: 'info', emit: 'stdout' },
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prisma.$on('query', (e) => {
  logger.warn(e); // 警告日志记录
});

prisma.$on('error', (e) => {
  logger.error(e); // 错误日志记录
});

export default prisma;
