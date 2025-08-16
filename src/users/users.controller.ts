import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("users") // Group endpoints under 'users' tag
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Validation errors" })
  @ApiResponse({ status: 409, description: "Email or username already exists" })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.usersService.register(registerDto);
  }
}
