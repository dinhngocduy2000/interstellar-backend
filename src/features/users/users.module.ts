import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { UserRepository } from "./user.repository.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { User } from "../../entities/index.js";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes(UsersController);
  }
}
