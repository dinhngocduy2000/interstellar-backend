import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { RegisterDto } from "../../dto/register.dto.js";
import { UserResponseDto } from "../../dto/user-response.dto.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("users") // Group endpoints under 'users' tag
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User registered successfully",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation errors",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Email or username already exists",
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.usersService.register(registerDto);
  }
}
