import { Request, Response } from 'express';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IReviewService } from "../../domain/review/interfaces/IReviewService";
import { AuthRequest } from "../../domain/user/interfaces/AuthRequest";
import { IUserService } from '../../domain/user/interfaces/IUserService';
import { User, UserRole } from '../../domain/user/entities/User';
import { AuthService } from "../../infrastructure/auth/AuthService";
import { TYPES } from "../../infrastructure/inversify.config";
import { UserValidator } from '../../validators/UserValidator';

@controller('/users')
export class UserController {
    constructor(
        @inject(TYPES.IUserService) private userService: IUserService,
        @inject('AuthService') private authService: AuthService,
        @inject(TYPES.IReviewService) private reviewService: IReviewService
    ) {}

    @httpGet('/')
    async getAllUsers(@request() _: Request, @response() res: Response) {
        const users = await this.userService.findAll();
        res.json(users);
    }

    @httpPost('/')
    async createUser(@request() req: Request, @response() res: Response) {
        const userParams = UserValidator.parse(req.body);
        const user = User.create(userParams);
        const savedUser = await this.userService.save(user);
        res.json(savedUser);
    }

    @httpGet('/:id')
    async getUser(@request() req: AuthRequest, @response() res: Response) {
        const user = await this.userService.findById(Number(req.params.id));
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    }

    @httpGet('/role/:role')
    async getUsersByRole(@request() req: Request, @response() res: Response) {
        const role = req.params.role as UserRole;
        const users = await this.userService.findByRole(role);
        res.json(users);
    }

    @httpGet('/:id/reviews')
    async getReviewsByUserId(@request() req: AuthRequest, @response() res: Response) {
        if (req.user.role !== UserRole.ADMIN) {
            return res.status(403).send('Forbidden');
        }

        const reviews = await this.reviewService.getReviewsByStudentId(Number(req.params.id));
        res.json(reviews);
    }

    @httpGet('/available-mentors')
    async getAvailableMentors(@request() req: AuthRequest, @response() res: Response) {
        const time = new Date(req.query.time as string);
        const mentors = await this.userService.findByRole(UserRole.MENTOR);
        const availableMentors = await Promise.all(mentors.map(async mentor => {
            const isAvailable = await this.reviewService.isMentorAvailable(mentor.id, time);
            return isAvailable ? mentor : null;
        }));
        res.json(availableMentors.filter(mentor => mentor !== null));
    }

    @httpPost('/login')
    async login(@request() req: Request, @response() res: Response) {
        const { email, password } = req.body;
        const result = await this.authService.login(email, password);
        if (result) {
            res.json(result);
        } else {
            res.status(401).send('Invalid email or password');
        }
    }
}