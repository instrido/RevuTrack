import { Request, Response, NextFunction } from 'express';
import { inject } from "inversify";
import * as jwt from 'jsonwebtoken';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { IUserService } from "../domain/user/interfaces/IUserService";
import { TYPES } from "../infrastructure/inversify.config";

@Middleware({ type: 'before' })
export class AuthMiddleware implements ExpressMiddlewareInterface {
    constructor(@inject(TYPES.IUserService) private userService: IUserService) {}

    public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.JWT_SECRET as string, async (err, payload) => {
                if (err) {
                    return res.sendStatus(403);
                }

                if (typeof payload === 'object' && 'userId' in payload && 'email' in payload) {
                    const user = await this.userService.findById(payload.userId);
                    if (!user) {
                        return res.sendStatus(403);
                    }

                    (req as any).user = payload as { userId: number; email: string; };
                    next();
                } else {
                    res.sendStatus(403);
                }
            });
        } else {
            res.sendStatus(401);
        }
    }
}