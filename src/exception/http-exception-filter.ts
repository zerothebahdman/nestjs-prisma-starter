import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import apiGatewayConfig from '../../config/api-gateway.config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;

    response.status(status).json({
      status: status.toString().startsWith('4') ? 'error' : 'fail',
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      ...(apiGatewayConfig().env === 'development' && { path: request.url }),
      ...(apiGatewayConfig().env === 'development' && {
        stack: exception.stack,
      }),
    });
  }
}
