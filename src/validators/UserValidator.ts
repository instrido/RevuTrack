import { z } from 'zod';
import { UserRole } from '../domain/user/entities/User';

export const UserValidator = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum([UserRole.STUDENT, UserRole.MENTOR, UserRole.ADMIN]),
});