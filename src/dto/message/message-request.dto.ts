import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class MessageRequestDTO {
  @ApiProperty({
    description: "The content of the message",
    example: "Hello, how are you?",
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(["true", "false"])
  isPrivate?: "true" | "false";
}
