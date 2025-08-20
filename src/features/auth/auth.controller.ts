import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service.js";
import { RegisterDto } from "../../dto/register.dto.js";
import { SuccessResponse } from "../../common/interface/success-response.js";
import { LoginResponseDto } from "../../dto/login-response.dto.js";
import { LoginDto } from "../../dto/login.dto.js";

@ApiTags("auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User registered successfully",
    type: SuccessResponse,
  })
  async register(@Body() registerDto: RegisterDto): Promise<SuccessResponse> {
    await this.authService.register(registerDto);
    return {
      message: "User registered successfully",
      code: HttpStatus.CREATED,
    };
  }

  @Post("/login")
  @ApiOperation({ summary: "Login a user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post("/refresh")
  @ApiOperation({ summary: "Refresh a user's session" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
    type: LoginResponseDto,
  })
  async refreshToken(
    @Body() { refreshToken }: { refreshToken: string }
  ): Promise<LoginResponseDto> {
    return await this.authService.refreshToken(refreshToken);
  }
}
