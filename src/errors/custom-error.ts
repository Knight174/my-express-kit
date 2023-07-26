// 定义 CustomAPIError 类，继承于 Error
class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export default CustomAPIError;
