import { Response } from 'express';
import { controller, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { ReviewStatus } from "../../domain/review/entities/Review";
import { IReviewService } from '../../domain/review/interfaces/IReviewService';
import {UserRole} from "../../domain/user/entities/User";
import { TYPES } from "../../infrastructure/inversify.config";
import { ReviewValidator } from '../../validators/ReviewValidator';
import { AuthRequest } from '../../domain/user/interfaces/AuthRequest';

@controller('/reviews')
export class ReviewController {
    constructor(@inject(TYPES.IReviewService) private reviewService: IReviewService) {}

    @httpPut('/:id/status')
    async updateStatus(@request() req: AuthRequest, @response() res: Response) {
        const status = req.body.status as ReviewStatus;
        const review = await this.reviewService.updateStatus(Number(req.params.id), status);
        res.json(review);
    }

    @httpGet('/')
    async getAllReviews(@request() req: AuthRequest, @response() res: Response) {
        if (req.user.role !== UserRole.ADMIN) {
            return res.status(403).send('Forbidden');
        }

        const reviews = await this.reviewService.findAll();
        res.json(reviews);
    }

    @httpGet('/student/:id')
    async getReviewsByStudentId(@request() req: AuthRequest, @response() res: Response) {
        const reviews = await this.reviewService.getReviewsByStudentId(Number(req.params.id));
        res.json(reviews);
    }

    @httpGet('/mentor/:id')
    async getReviewsByMentorId(@request() req: AuthRequest, @response() res: Response) {
        const reviews = await this.reviewService.getReviewsByMentorId(Number(req.params.id));
        res.json(reviews);
    }

    @httpPost('/')
    async createReview(@request() req: AuthRequest, @response() res: Response) {
        const reviewParams = ReviewValidator.parse(req.body);
        const review = await this.reviewService.save(reviewParams);
        res.json(review);
    }

    @httpPut('/:id/start')
    async startReview(@request() req: AuthRequest, @response() res: Response) {
        const review = await this.reviewService.startReview(Number(req.params.id), req.user.userId);
        res.json(review);
    }

    @httpPut('/:id/cancel')
    async cancelReview(@request() req: AuthRequest, @response() res: Response) {
        await this.reviewService.cancelReview(Number(req.params.id), req.user.userId);
        res.sendStatus(200);
    }

    @httpPut('/:id/complete')
    async completeReview(@request() req: AuthRequest, @response() res: Response) {
        const { score, comment } = req.body;
        const review = await this.reviewService.completeReview(Number(req.params.id), req.user.userId, score, comment);
        res.json(review);
    }
}