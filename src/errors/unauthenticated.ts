import CustomAPIError from './custom-error';
import { StatusCodes } from 'http-status-codes';

// 定义 UnauthenticatedError 类，继承于 CustomAPIError
class UnauthenticatedError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
