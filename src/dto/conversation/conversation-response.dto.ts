import { ApiProperty } from "@nestjs/swagger";
import { Conversation, Message } from "src/entities/index.js";

export class ConversationResponseDTO implements Conversation {
  @ApiProperty({
    description: "The ID of the conversation",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "The title of the conversation",
    example: "My first conversation",
  })
  title: string;

  @ApiProperty({
    description: "The description of the conversation",
    example: "This is a description of my first conversation",
  })
  description: string;

  @ApiProperty({
    description: "The created_at of the conversation",
    example: "2021-01-01",
  })
  created_at: string;

  @ApiProperty({
    description: "The updated_at of the conversation",
    example: "2021-01-01",
  })
  updated_at: string;

  @ApiProperty({
    description: "Whether the conversation is pinned",
    example: false,
  })
  is_pinned: boolean;

  @ApiProperty({
    description: "The model of the conversation",
    example: "gpt-4o",
  })
  model: string;

  @ApiProperty({
    description: "The user ID of the conversation",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  user_id: string;

  @ApiProperty({
    description: "The messages of the conversation",
    example: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        content: "Hello, how are you?",
      },
    ],
  })
  messages: Message[];

  @ApiProperty({
    description: "The deleted_at of the conversation",
    example: "2021-01-01",
  })
  deleted_at: string;
}
