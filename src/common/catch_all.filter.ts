import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    console.log(exception);
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server error',
      timestamp: new Date().toISOString(),
    });
  }
}
