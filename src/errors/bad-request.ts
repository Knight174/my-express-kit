import CustomAPIError from './custom-error';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

// 定义 BadRequest 类，继承于 CustomAPIError
class BadRequest extends CustomAPIError {
  statusCode: number;

  constructor(message: string = ReasonPhrases.BAD_REQUEST) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST; // 400
  }
}

export default BadRequest;
