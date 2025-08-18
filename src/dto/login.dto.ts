import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @MinLength(1, { message: "Username is required" })
  @ApiProperty({
    description: "The username of the user",
    example: "John Doe",
  })
  username: string;

  @IsString()
  @MinLength(1, { message: "Password is required" })
  @ApiProperty({
    description: "The password of the user",
    example: "Password123",
  })
  password: string;
}
