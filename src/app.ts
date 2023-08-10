import 'reflect-metadata';
import {NextFunction, Request, Response} from "express";
import { InversifyExpressServer } from 'inversify-express-utils';
import {IReviewService} from "./domain/review/interfaces/IReviewService";
import {IUserService} from "./domain/user/interfaces/IUserService";
import {container, TYPES} from './infrastructure/inversify.config';
import { ErrorHandler } from './middleware/ErrorHandler';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import './application/controllers/UserController';
import './application/controllers/ReviewController';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(cors());
    app.use(bodyParser.json());

    const userService = container.get<IUserService>(TYPES.IUserService);
    const authMiddleware = new AuthMiddleware(userService);
    app.use('/reviews', authMiddleware.use.bind(authMiddleware));
    app.use('/users', authMiddleware.use.bind(authMiddleware));
});

server.setErrorConfig((app) => {
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        new ErrorHandler().error(err, req, res, next);
    });
});

const app = server.build();

export default app;