import { Response } from 'express';

const sendErrorResponse = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, message });
};

const sendSuccessResponse = (res: Response, message: string, data?: any) => {
  return res.json({ success: true, message, data });
};

export { sendErrorResponse, sendSuccessResponse };
