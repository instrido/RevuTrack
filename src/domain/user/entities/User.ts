import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';

export enum UserRole {
    STUDENT = 'student',
    MENTOR = 'mentor',
    ADMIN = 'admin',
}

const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum([UserRole.STUDENT, UserRole.MENTOR, UserRole.ADMIN]),
});

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.STUDENT,
    })
    role!: UserRole;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compare(unencryptedPassword, this.password);
    }

    static create(params: z.infer<typeof UserSchema>) {
        UserSchema.parse(params);
        const user = new User();
        user.name = params.name;
        user.email = params.email;
        user.password = params.password;
        user.role = params.role;
        user.hashPassword();
        return user;
    }
}