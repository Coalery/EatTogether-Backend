interface ErrorType {
  code: number;
  message: string;
  timestamp: string;
}

class Resp {
  private static ERROR_MESSAGE = {
    400: 'Bad Request',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };

  static ok(data: any, raw?: boolean) {
    if (raw) return data;
    return { code: 200, data: data };
  }

  static error(code: number, message?: string): ErrorType {
    let resultMessage: string = this.ERROR_MESSAGE[code];
    if (message) {
      resultMessage = resultMessage.concat(' : ').concat(message);
    }

    return {
      code,
      message: resultMessage,
      timestamp: new Date().toISOString(),
    };
  }
}

export { ErrorType, Resp };
