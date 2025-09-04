import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail(undefined, { message: "Please provide a valid email address" })
  @MinLength(1, { message: "Email is required" })
  @ApiProperty({
    description: "The email of the user",
    example: "John Doe",
  })
  email: string;

  @IsString()
  @MinLength(1, { message: "Password is required" })
  @ApiProperty({
    description: "The password of the user",
    example: "Password123",
  })
  password: string;
}
