import { injectable, inject } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { IUserService } from '../../domain/user/interfaces/IUserService';
import { TYPES } from "../inversify.config";

@injectable()
export class AuthService {
    constructor(@inject(TYPES.IUserService) private userService: IUserService) {}

    async authenticate(email: string, password: string): Promise<string | null> {
        const user = await this.userService.findByEmail(email);
        if (user?.checkIfUnencryptedPasswordIsValid(password)) {
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );
            return token;
        }
        return null;
    }

    async login(email: string, password: string): Promise<{ token: string } | null> {
        const token = await this.authenticate(email, password);
        return token ? { token } : null;
    }
}