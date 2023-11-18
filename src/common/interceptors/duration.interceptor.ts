import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DurationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = new Date();
    const { method, url } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const endTime = new Date();
        const processingTime = endTime.getTime() - startTime.getTime();
        const statusCode = context.switchToHttp().getResponse().statusCode;
        console.log(`${method} ${url} ${statusCode} - ${processingTime}ms`);
      }),
    );
  }
}
