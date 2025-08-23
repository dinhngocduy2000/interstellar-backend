import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MessageRequestDTO {
  @ApiProperty({
    description: "The content of the message",
    example: "Hello, how are you?",
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
