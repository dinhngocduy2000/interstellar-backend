import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({
    description: "The access token of the user",
    example: "1234567890",
  })
  accessToken: string;

  @ApiProperty({
    description: "The refresh token of the user",
    example: "1234567890",
  })
  refreshToken: string;

  @ApiProperty({
    description: "Token expire time",
    example: "1234567890",
  })
  expiresIn: number;

  @ApiProperty({
    description: "User's email",
    example: "john@example.com",
  })
  email: string;

  @ApiProperty({
    description: "User's username",
    example: "John",
  })
  username: string;

  @ApiProperty({
    description: "User's role",
    example: "admin",
  })
  role: string;
}
