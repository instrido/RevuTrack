import { z } from 'zod';
import { ReviewStatus } from '../domain/review/entities/Review';

export const ReviewValidator = z.object({
    student: z.object({ id: z.number() }),
    mentor: z.object({ id: z.number() }),
    status: z.enum([ReviewStatus.PENDING, ReviewStatus.IN_PROGRESS, ReviewStatus.COMPLETED, ReviewStatus.CANCELED]),
    startTime: z.date(),
    endTime: z.date(),
    score: z.number().optional(),
    comment: z.string().optional(),
});