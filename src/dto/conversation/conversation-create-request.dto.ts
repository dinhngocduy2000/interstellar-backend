import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ConversationCreateRequestDTO {
  @ApiProperty({
    description: "The title of the conversation",
    example: "My first conversation",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "The model of the conversation",
    example: "gpt-4o",
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    description: "The description of the conversation",
    example: "This is a description of my first conversation",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
