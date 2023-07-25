import { Response } from 'express';
import { ERROR_CODES } from '../config/constant';

const sendErrorResponse = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, message });
};

const sendSuccessResponse = (res: Response, message: string, data?: any) => {
  return res.json({ success: true, message, data });
};

const handlePrismaError = (res: Response, error: unknown) => {
  // console.error('Prisma 查询出错:', error);
  return sendErrorResponse(
    res,
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    'Internal Server Error'
  );
};

export { sendErrorResponse, sendSuccessResponse, handlePrismaError };
