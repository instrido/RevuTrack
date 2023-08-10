import { User, UserRole } from '../../src/domain/user/entities/User';
import { Review, ReviewStatus } from '../../src/domain/review/entities/Review';
import { dataSource } from '../../src/infrastructure/database/DatabaseConfig';

async function createUsers() {
    const userRepository = dataSource.getRepository(User);

    for (let i = 0; i < 10; i++) {
        const user = new User();
        user.name = `Student ${i}`;
        user.email = `student${i}@example.com`;
        user.password = 'password';
        user.role = UserRole.STUDENT;
        user.hashPassword();
        await userRepository.save(user);
    }

    for (let i = 0; i < 5; i++) {
        const user = new User();
        user.name = `Mentor ${i}`;
        user.email = `mentor${i}@example.com`;
        user.password = 'password';
        user.role = UserRole.MENTOR;
        user.hashPassword();
        await userRepository.save(user);
    }
}

async function createReviews() {
    const userRepository = dataSource.getRepository(User);
    const reviewRepository = dataSource.getRepository(Review);

    const students = await userRepository.createQueryBuilder("user")
        .where("user.role = :role", { role: UserRole.STUDENT })
        .getMany();

    const mentors = await userRepository.createQueryBuilder("user")
        .where("user.role = :role", { role: UserRole.MENTOR })
        .getMany();

    for (let i = 0; i < 20; i++) {
        const review = new Review();
        review.student = students[i % students.length];
        review.mentor = mentors[i % mentors.length];
        review.status = i % 2 === 0 ? ReviewStatus.PENDING : ReviewStatus.COMPLETED;
        review.startTime = new Date();
        review.endTime = new Date(review.startTime.getTime() + 60 * 60 * 1000);
        if (review.status === ReviewStatus.COMPLETED) {
            review.score = Math.floor(Math.random() * 10) + 1;
            review.comment = 'Great job!';
        }
        await reviewRepository.save(review);
    }
}

async function run() {
    await dataSource.synchronize(true);

    await createUsers();
    await createReviews();

    console.log('Seeding completed!');
}

run().catch(console.error);