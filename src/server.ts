import app from './app';
import {container, TYPES} from './infrastructure/inversify.config';
import { IReviewService } from './domain/review/interfaces/IReviewService';
import { ReviewScheduler } from './domain/review/services/ReviewScheduler';

if (!process.env.JWT_SECRET || !process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    console.error('Missing environment variables');
    process.exit(1);
}

const PORT = process.env.PORT ?? 3000;

const reviewService = container.get<IReviewService>(TYPES.IReviewService);

const reviewScheduler = new ReviewScheduler(reviewService);
reviewScheduler.start();

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});