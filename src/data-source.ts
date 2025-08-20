// src/data-source.ts
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { DataSource } from "typeorm";

// Load environment variables from .env file
config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get("POSTGRES_HOST", "localhost"),
  port: configService.get("POSTGRES_PORT", 5432),
  username: configService.get("POSTGRES_USER"),
  password: configService.get("POSTGRES_PASSWORD"),
  database: configService.get("POSTGRES_DB"),
  entities: ["src/entities/index.ts"], // Use glob pattern to include all entities
  migrations: ["src/migrations/**/*.ts"],
});
