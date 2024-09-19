import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env` });
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.RDS_HOST,
  port: parseInt(process.env.RDS_PORT),
  database: process.env.RDS_DATABASE,
  username: process.env.RDS_USER_NAME,
  password: process.env.RDS_PASSWORD,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrationsTableName: 'migration_table',
});
