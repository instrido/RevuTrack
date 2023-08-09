import { Request } from 'express';
import {UserRole} from "../entities/User";

export interface AuthRequest extends Request {
    user: {
        userId: number;
        email: string;
        role: UserRole;
    };
}