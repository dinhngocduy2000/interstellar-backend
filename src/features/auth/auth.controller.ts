import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service.js";
import { RegisterDto } from "../users/dto/register.dto.js";
import { SuccessResponse } from "../../common/interface/success-response.js";

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
}
