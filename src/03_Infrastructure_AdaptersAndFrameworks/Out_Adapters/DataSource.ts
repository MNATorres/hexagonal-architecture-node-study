import { DataSource } from "typeorm";
import { UserOrmEntity } from "./UserOrmEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "hexagonal_db",
  synchronize: true, // Only for dev purposes
  logging: false,
  entities: [UserOrmEntity],
});
