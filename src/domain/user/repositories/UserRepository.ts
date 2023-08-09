import { dataSource } from '../../../infrastructure/database/DatabaseConfig';
import { User, UserRole } from '../entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { injectable } from 'inversify';

@injectable()
export class UserRepository implements IUserRepository {
    private repository = dataSource.getRepository(User);

    async findById(id: number): Promise<User | undefined> {
        const user = await this.repository.findOne({ where: { id } });
        return user ?? undefined;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.repository.findOne({ where: { email } });
        return user ?? undefined;
    }

    async findByRole(role: UserRole): Promise<User[]> {
        return this.repository.find({ where: { role } });
    }

    async findAll(): Promise<User[]> {
        return this.repository.find();
    }

    async save(user: User): Promise<User> {
        return this.repository.save(user);
    }
}