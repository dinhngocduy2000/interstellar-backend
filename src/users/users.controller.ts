import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.usersService.register(registerDto);
  }
}
