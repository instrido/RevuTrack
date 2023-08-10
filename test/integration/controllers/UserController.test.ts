import request from 'supertest';
import app from '../../../src/app';
import { container } from '../../../src/infrastructure/inversify.config';
import { IUserService } from '../../../src/domain/user/interfaces/IUserService';
import { User, UserRole } from '../../../src/domain/user/entities/User';

describe('UserController', () => {
    let userService: IUserService;

    beforeEach(() => {
        userService = container.get<IUserService>('IUserService');
    });

    it('should get all users', async () => {
        const users = [
            { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password', role: UserRole.STUDENT },
            { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'password', role: UserRole.MENTOR },
        ];

        userService.findAll = jest.fn().mockResolvedValue(users);

        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(users);
    });

    it('should create a user', async () => {
        const user = { name: 'John Doe', email: 'john@example.com', password: 'password', role: UserRole.STUDENT };

        userService.save = jest.fn().mockResolvedValue(user);

        const response = await request(app).post('/users').send(user);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
    });
});