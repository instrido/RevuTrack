import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { z } from 'zod';
import { User } from '../../user/entities/User';

export enum ReviewStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELED = 'canceled',
}

const ReviewSchema = z.object({
    student: z.object({ id: z.number() }),
    mentor: z.object({ id: z.number() }),
    status: z.enum([ReviewStatus.PENDING, ReviewStatus.IN_PROGRESS, ReviewStatus.COMPLETED, ReviewStatus.CANCELED]),
    startTime: z.date(),
    endTime: z.date(),
    score: z.number().optional(),
    comment: z.string().optional(),
});

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    student!: User;

    @ManyToOne(() => User, (user) => user.id)
    mentor!: User;

    @Column({
        type: 'enum',
        enum: ReviewStatus,
        default: ReviewStatus.PENDING,
    })
    status!: ReviewStatus;

    @Column()
    startTime!: Date;

    @Column()
    endTime!: Date;

    @Column({ nullable: true })
    score?: number;

    @Column({ nullable: true })
    comment?: string;
}