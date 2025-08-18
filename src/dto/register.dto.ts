import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @ApiProperty({
    description: "The email of the user",
    example: "john@example.com",
  })
  email!: string;

  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(20, { message: "Username must not exceed 20 characters" })
  @ApiProperty({ description: "The username of the user", example: "John Doe" })
  username!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(100, { message: "Password must not exceed 100 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  @ApiProperty({
    description: "The password of the user",
    example: "Password123",
  })
  password!: string;

  @IsString()
  @ApiProperty({
    description: "The first name of the user",
    example: "John",
  })
  firstName!: string;

  @IsString()
  @MinLength(3, { message: "Last name must be at least 3 characters long" })
  @MaxLength(20, { message: "Last name must not exceed 20 characters" })
  @ApiProperty({
    description: "The last name of the user",
    example: "Doe",
  })
  lastName!: string;
}
