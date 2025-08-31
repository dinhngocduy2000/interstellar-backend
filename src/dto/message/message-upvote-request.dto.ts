import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";

export class MessageUpvoteRequestDTO {
  @ApiProperty({
    description: "The ID of the message",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsNotEmpty()
  @IsUUID()
  message_id: string;

  @ApiProperty({
    description: "Upvote",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  upvote: boolean;
}
