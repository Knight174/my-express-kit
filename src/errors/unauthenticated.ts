import CustomAPIError from './custom-error';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

// 定义 UnauthenticatedError 类，继承于 CustomAPIError
class UnauthenticatedError extends CustomAPIError {
  statusCode: number;
  constructor(message: string = ReasonPhrases.UNAUTHORIZED) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED; // 401
  }
}

export default UnauthenticatedError;
