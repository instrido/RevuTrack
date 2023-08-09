import { injectable, inject } from 'inversify';
import { TYPES } from "../../../infrastructure/inversify.config";
import {User, UserRole} from '../entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUserService } from '../interfaces/IUserService';

@injectable()
export class UserService implements IUserService {
    constructor(@inject(TYPES.IUserService) private userRepository: IUserRepository) {}

    async findById(id: number): Promise<User | undefined> {
        return this.userRepository.findById(id);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findByEmail(email);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async findByRole(role: UserRole): Promise<User[]> {
        return this.userRepository.findByRole(role);
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}