import { Review, ReviewStatus } from '../entities/Review';

export interface IReviewRepository {
    findById(id: number): Promise<Review | undefined>;
    findAll(): Promise<Review[]>;
    findByMentorId(mentorId: number): Promise<Review[]>;
    findByStudentId(studentId: number): Promise<Review[]>;
    findByReviewStatus(status: ReviewStatus): Promise<Review[]>;
    save(review: Review): Promise<Review>;
}