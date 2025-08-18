import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponse {
  @ApiProperty({
    description: "The message of the response",
    example: "User registered successfully",
  })
  message!: string;

  @ApiProperty({
    description: "The code of the response",
    example: HttpStatus.CREATED,
  })
  code!: number;
}
