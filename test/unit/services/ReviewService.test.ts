import { ReviewService } from '../../../src/domain/review/services/ReviewService';
import { ReviewRepository } from '../../../src/domain/review/repositories/ReviewRepository';
import { UserRepository } from "../../../src/domain/user/repositories/UserRepository";
import { UserService } from '../../../src/domain/user/services/UserService';
import { Review, ReviewStatus } from '../../../src/domain/review/entities/Review';
import { User, UserRole } from '../../../src/domain/user/entities/User';

describe('ReviewService', () => {
    let reviewService: ReviewService;
    let reviewRepository: ReviewRepository;
    let userService: UserService;

    beforeEach(() => {
        reviewRepository = new ReviewRepository();
        userService = new UserService(new UserRepository());
        reviewService = new ReviewService(reviewRepository, userService);
    });

    it('should find review by id', async () => {
        const review = new Review();
        review.id = 1;
        review.student = new User();
        review.mentor = new User();
        review.status = ReviewStatus.PENDING;
        review.startTime = new Date();
        review.endTime = new Date();

        reviewRepository.findById = jest.fn().mockResolvedValue(review);

        const result = await reviewService.findById(1);

        expect(result).toEqual(review);
        expect(reviewRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should check if mentor is available', async () => {
        const review = new Review();
        review.id = 1;
        review.student = new User();
        review.mentor = new User();
        review.status = ReviewStatus.PENDING;
        review.startTime = new Date();
        review.endTime = new Date();

        reviewRepository.findByMentorId = jest.fn().mockResolvedValue([review]);

        const result = await reviewService.isMentorAvailable(1, new Date());

        expect(result).toBe(false);
        expect(reviewRepository.findByMentorId).toHaveBeenCalledWith(1);
    });
});