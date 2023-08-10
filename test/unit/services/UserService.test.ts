import { UserService } from '../../../src/domain/user/services/UserService';
import { UserRepository } from '../../../src/domain/user/repositories/UserRepository';
import { User, UserRole } from '../../../src/domain/user/entities/User';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeEach(() => {
        userRepository = new UserRepository();
        userService = new UserService(userRepository);
    });

    it('should find user by id', async () => {
        const user = new User();
        user.id = 1;
        user.name = 'John Doe';
        user.email = 'john@example.com';
        user.password = 'password';
        user.role = UserRole.STUDENT;

        userRepository.findById = jest.fn().mockResolvedValue(user);

        const result = await userService.findById(1);

        expect(result).toEqual(user);
        expect(userRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should find user by email', async () => {
        const user = new User();
        user.id = 1;
        user.name = 'John Doe';
        user.email = 'john@example.com';
        user.password = 'password';
        user.role = UserRole.STUDENT;

        userRepository.findByEmail = jest.fn().mockResolvedValue(user);

        const result = await userService.findByEmail('john@example.com');

        expect(result).toEqual(user);
        expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    });
});