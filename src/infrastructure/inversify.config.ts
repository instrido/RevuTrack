import { Container } from 'inversify';
import { IUserService } from '../domain/user/interfaces/IUserService';
import { UserService } from '../domain/user/services/UserService';
import { IUserRepository } from '../domain/user/interfaces/IUserRepository';
import { UserRepository } from '../domain/user/repositories/UserRepository';
import { IReviewService } from '../domain/review/interfaces/IReviewService';
import { ReviewService } from '../domain/review/services/ReviewService';
import { IReviewRepository } from '../domain/review/interfaces/IReviewRepository';
import { ReviewRepository } from '../domain/review/repositories/ReviewRepository';

const TYPES = {
    IUserService: Symbol.for('IUserService'),
    IUserRepository: Symbol.for('IUserRepository'),
    IReviewService: Symbol.for('IReviewService'),
    IReviewRepository: Symbol.for('IReviewRepository'),
};

const container = new Container();

container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IReviewService>(TYPES.IReviewService).to(ReviewService);
container.bind<IReviewRepository>(TYPES.IReviewRepository).to(ReviewRepository);

export { container, TYPES };