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

  static ok(data: any) {
    return { code: 200, data: data };
  }

  static error(code: number): ErrorType {
    return {
      code,
      message: this.ERROR_MESSAGE[code],
      timestamp: new Date().toISOString(),
    };
  }
}

export { ErrorType, Resp };
