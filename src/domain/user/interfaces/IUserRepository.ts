import { User } from '../entities/User';

export interface IUserRepository {
    findById(id: number): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    findByRole(role: string): Promise<User[]>;
    findAll(): Promise<User[]>;
    save(user: User): Promise<User>;
}