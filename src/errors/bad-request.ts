import CustomAPIError from './custom-error';
import { StatusCodes } from 'http-status-codes';

// 定义 BadRequest 类，继承于 CustomAPIError
class BadRequest extends CustomAPIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;
