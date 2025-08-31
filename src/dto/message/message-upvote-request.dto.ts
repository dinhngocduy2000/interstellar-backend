import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";

export class MessageUpvoteRequestDTO {
  @ApiProperty({
    description: "Upvote",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  upvote: boolean;
}
