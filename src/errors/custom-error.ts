import { getReasonPhrase } from 'http-status-codes';

// 定义 CustomAPIError 类，继承于 Error
class CustomAPIError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    if (statusCode) {
      this.statusCode = statusCode;
      this.message = message || getReasonPhrase(statusCode) || '';
    }
  }
}

export default CustomAPIError;
