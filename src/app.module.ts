import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./features/users/users.module.js";
import { User as UserEntity, Conversation, Message } from "./entities/index.js";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./features/auth/auth.module.js";
import { ConversationModule } from "./features/conversation/conversation.module.js";
import { MessageModule } from "./features/message/message.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: ".env", // Path to your .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST", "localhost"),
        port: configService.get<number>("POSTGRES_PORT", 5432),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DB"),
        entities: [UserEntity, Conversation, Message],
        migrationsRun: false, // Set to true to run migrations automatically on startup
        synchronize: false, // Disable in production to use migrations instead
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ConversationModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
