import { DataSource } from 'typeorm';
import { User } from '../../domain/user/entities/User';
import { Review } from '../../domain/review/entities/Review';

export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Review],
});

dataSource.initialize().catch((err) => {
    console.error(err);
    process.exit(1);
})