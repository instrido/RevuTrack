import cron from 'node-cron';
import { IReviewService } from '../interfaces/IReviewService';

export class ReviewScheduler {
    constructor(private reviewService: IReviewService) {}

    start() {
        // Run every minute
        cron.schedule('* * * * *', async () => {
            await this.reviewService.checkReviewTimes();
        });
    }
}