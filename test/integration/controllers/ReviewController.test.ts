import request from 'supertest';
import app from '../../../src/app';
import { container } from '../../../src/infrastructure/inversify.config';
import { IReviewService } from '../../../src/domain/review/interfaces/IReviewService';
import { Review, ReviewStatus } from '../../../src/domain/review/entities/Review';
import { User, UserRole } from '../../../src/domain/user/entities/User';

describe('ReviewController', () => {
    let reviewService: IReviewService;

    beforeEach(() => {
        reviewService = container.get<IReviewService>('IReviewService');
    });

    it('should get all reviews', async () => {
        const reviews = [
            { id: 1, student: new User(), mentor: new User(), status: ReviewStatus.PENDING, startTime: new Date(), endTime: new Date() },
            { id: 2, student: new User(), mentor: new User(), status: ReviewStatus.COMPLETED, startTime: new Date(), endTime: new Date() },
        ];

        reviewService.findAll = jest.fn().mockResolvedValue(reviews);

        const response = await request(app).get('/reviews');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(reviews);
    });

    it('should create a review', async () => {
        const review = { student: { id: 1 }, mentor: { id: 2 }, status: ReviewStatus.PENDING, startTime: new Date(), endTime: new Date() };

        reviewService.save = jest.fn().mockResolvedValue(review);

        const response = await request(app).post('/reviews').send(review);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(review);
    });
});