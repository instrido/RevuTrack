import { dataSource } from '../../../infrastructure/database/DatabaseConfig';
import { Review, ReviewStatus } from '../entities/Review';
import { IReviewRepository } from '../interfaces/IReviewRepository';
import { injectable } from 'inversify';

@injectable()
export class ReviewRepository implements IReviewRepository {
    private repository = dataSource.getRepository(Review);

    async findById(id: number): Promise<Review | undefined> {
        const review = await this.repository.findOne({ where: { id } });
        return review ?? undefined;
    }

    async findAll(): Promise<Review[]> {
        return this.repository.find();
    }

    async findByMentorId(mentorId: number): Promise<Review[]> {
        return this.repository.createQueryBuilder("review")
            .innerJoin("review.mentor", "mentor")
            .where("mentor.id = :mentorId", { mentorId })
            .getMany();
    }

    async findByStudentId(studentId: number): Promise<Review[]> {
        return this.repository.createQueryBuilder("review")
            .innerJoin("review.student", "student")
            .where("student.id = :studentId", { studentId })
            .getMany();
    }

    async findByReviewStatus(status: ReviewStatus): Promise<Review[]> {
        return this.repository.find({ where: { status } });
    }

    async save(review: Review): Promise<Review> {
        return this.repository.save(review);
    }
}