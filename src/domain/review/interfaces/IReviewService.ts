import { z } from "zod";
import { User } from "../../user/entities/User";
import { Review, ReviewStatus } from '../entities/Review';
import { ReviewValidator } from '../../../validators/ReviewValidator';

export interface IReviewService {
    findById(id: number): Promise<Review | undefined>;
    findAll(): Promise<Review[]>;
    save(params: z.infer<typeof ReviewValidator>): Promise<Review>;
    updateStatus(id: number, status: ReviewStatus, score?: number, comment?: string): Promise<Review>;
    isMentorAvailable(mentorId: number, time: Date): Promise<boolean>;
    checkReviewTimes(): Promise<void>;
    getReviewsByStudentId(studentId: number): Promise<Review[]>;
    getReviewsByMentorId(mentorId: number): Promise<Review[]>;
    getAvailableMentors(time: Date): Promise<User[]>;
    startReview(id: number, mentorId: number): Promise<Review>;
    cancelReview(id: number, studentId: number): Promise<void>;
    completeReview(id: number, mentorId: number, score: number, comment: string): Promise<Review>;
}