import { injectable, inject } from 'inversify';
import { z } from "zod";
import { TYPES } from "../../../infrastructure/inversify.config";
import { User, UserRole } from "../../user/entities/User";
import { Review, ReviewStatus } from '../entities/Review';
import { IReviewRepository } from '../interfaces/IReviewRepository';
import { IReviewService } from '../interfaces/IReviewService';
import { IUserService } from '../../user/interfaces/IUserService';
import { ReviewValidator } from '../../../validators/ReviewValidator';

@injectable()
export class ReviewService implements IReviewService {
    constructor(
        @inject(TYPES.IReviewRepository) private reviewRepository: IReviewRepository,
        @inject(TYPES.IUserService) private userService: IUserService
    ) {}

    async findById(id: number): Promise<Review | undefined> {
        return this.reviewRepository.findById(id);
    }

    async findAll(): Promise<Review[]> {
        return this.reviewRepository.findAll();
    }

    async updateStatus(id: number, status: ReviewStatus, score?: number, comment?: string): Promise<Review> {
        try {
            const review = await this.reviewRepository.findById(id);
            if (!review) {
                throw new Error('Review not found');
            }

            switch (status) {
                case ReviewStatus.IN_PROGRESS:
                    if (review.status !== ReviewStatus.PENDING || new Date() < review.startTime) {
                        throw new Error('Invalid status transition');
                    }
                    break;
                case ReviewStatus.COMPLETED:
                    if (review.status !== ReviewStatus.IN_PROGRESS || score === undefined || comment === undefined) {
                        throw new Error('Invalid status transition');
                    }
                    review.score = score;
                    review.comment = comment;
                    break;
                case ReviewStatus.CANCELED:
                    if (review.status !== ReviewStatus.PENDING && review.status !== ReviewStatus.IN_PROGRESS) {
                        throw new Error('Invalid status transition');
                    }
                    break;
                default:
                    throw new Error('Invalid status');
            }

            review.status = status;
            return this.reviewRepository.save(review);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update review status');
        }
    }

    async save(params: z.infer<typeof ReviewValidator>): Promise<Review> {
        try {
            const mentor = await this.userService.findById(params.mentor.id);
            if (!mentor || !(await this.isMentorAvailable(mentor.id, params.startTime))) {
                throw new Error('Mentor is not available at the specified time');
            }

            const student = await this.userService.findById(params.student.id);

            if (!student) {
                throw new Error('Student or mentor not found');
            }

            if (params.startTime >= params.endTime) {
                throw new Error('Start time must be before end time');
            }

            if (params.startTime.getMinutes() !== 0 && params.startTime.getMinutes() !== 30) {
                throw new Error('Reviews can only be scheduled at specific times');
            }

            if (params.startTime.getMinutes() % 30 !== 0 || params.endTime.getMinutes() % 30 !== 0) {
                throw new Error('Reviews must be scheduled in 30-minute increments');
            }

            if (Math.abs(params.endTime.getTime() - params.startTime.getTime()) !== 60 * 60 * 1000) {
                throw new Error('Reviews must last 60 minutes');
            }

            const review = new Review();
            review.student = student;
            review.mentor = mentor;
            review.status = params.status;
            review.startTime = params.startTime;
            review.endTime = params.endTime;
            review.score = params.score;
            review.comment = params.comment;

            return this.reviewRepository.save(review);
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to save review: ${(error as Error).message}`);
        }
    }

    async isMentorAvailable(mentorId: number, time: Date): Promise<boolean> {
        const reviews = await this.reviewRepository.findByMentorId(mentorId);
        return !reviews.some((review: Review) =>
            (review.status === ReviewStatus.PENDING || review.status === ReviewStatus.IN_PROGRESS) &&
            review.startTime <= time &&
            review.endTime > time
        );
    }

    async checkReviewTimes(): Promise<void> {
        const reviews = await this.reviewRepository.findByReviewStatus(ReviewStatus.IN_PROGRESS);
        const now = new Date();
        for (const review of reviews) {
            if (review.endTime <= now) {
                review.status = ReviewStatus.COMPLETED;
                review.score = review.score ?? 0;
                review.comment = review.comment ?? '';
                await this.reviewRepository.save(review);
            }
        }
    }

    async getAvailableMentors(time: Date): Promise<User[]> {
        const mentors = await this.userService.findByRole(UserRole.MENTOR);
        return Promise.all(mentors.filter(async mentor => {
            return this.isMentorAvailable(mentor.id, time);
        }));
    }

    async getReviewsByStudentId(studentId: number): Promise<Review[]> {
        return this.reviewRepository.findByStudentId(studentId);
    }

    async getReviewsByMentorId(mentorId: number): Promise<Review[]> {
        return this.reviewRepository.findByMentorId(mentorId);
    }

    async startReview(id: number, mentorId: number): Promise<Review> {
        const review = await this.reviewRepository.findById(id);
        if (!review || review.mentor.id !== mentorId || review.status !== ReviewStatus.PENDING) {
            throw new Error('Cannot start review');
        }
        review.status = ReviewStatus.IN_PROGRESS;
        return this.reviewRepository.save(review);
    }

    async completeReview(id: number, mentorId: number, score: number, comment: string): Promise<Review> {
        const review = await this.reviewRepository.findById(id);
        if (!review || review.mentor.id !== mentorId || review.status !== ReviewStatus.IN_PROGRESS) {
            throw new Error('Cannot complete review');
        }
        review.status = ReviewStatus.COMPLETED;
        review.score = score;
        review.comment = comment;
        return this.reviewRepository.save(review);
    }

    async cancelReview(id: number, studentId: number): Promise<void> {
        const review = await this.reviewRepository.findById(id);
        if (!review || review.student.id !== studentId || review.status !== ReviewStatus.PENDING) {
            throw new Error('Cannot cancel review');
        }
        review.status = ReviewStatus.CANCELED;
        await this.reviewRepository.save(review);
    }
}