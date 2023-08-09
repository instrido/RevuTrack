import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    public error(error: any, req: Request, res: Response, next: NextFunction): void {
        Sentry.captureException(error);
        res.status(500).json({
            name: error.name,
            message: error.message,
        });
    }
}