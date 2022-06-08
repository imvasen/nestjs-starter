import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { Logger } from '@/common';

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  private logger: Logger;

  constructor() {
    const logLabel = 'HttpExceptionFilter';
    this.logger = new Logger(logLabel);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.http({
      message: `${request.method} ${request.url} (${status})`,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
