import { ApiProperty } from "@nestjs/swagger";
import { Conversation, Message } from "../../entities/index.js";
import { ResponseDataWithPagination } from "../../common/interface/response-data-with-pagination.js";

export class MessageResponseDTO implements Message {
  @ApiProperty({
    description: "The ID of the message",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;
  @ApiProperty({
    description: "The created_at of the message",
    example: "2021-01-01",
  })
  created_at: string;
  @ApiProperty({
    description: "The updated_at of the message",
    example: "2021-01-01",
  })
  updated_at: string;
  @ApiProperty({
    description: "Whether the message is upvoted",
    example: false,
  })
  is_upvote: boolean;
  @ApiProperty({
    description: "Whether the message is downvoted",
    example: false,
  })
  is_downvote: boolean;
  @ApiProperty({
    description: "The conversation of the message",
    example: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "My first conversation",
    },
  })
  conversation?: Conversation | undefined;
  @ApiProperty({
    description: "The author of the message",
    example: "user",
  })
  author: "user" | "bot";
  @ApiProperty({
    description: "The conversation_id of the message",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  conversation_id: string;
  @ApiProperty({
    description: "The content of the message",
    example: "Hello, how are you?",
  })
  content: string;
}

export class ListMessageResponseDTO
  implements ResponseDataWithPagination<MessageResponseDTO>
{
  @ApiProperty({
    description: "The messages",
    type: [MessageResponseDTO],
    example: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        content: "Hello, how are you?",
      },
    ],
  })
  data: MessageResponseDTO[];
  @ApiProperty({
    description: "The total number of messages",
    example: 10,
  })
  total: number;
}
