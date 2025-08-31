import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class MessageDownvoteRequestDTO {
  @ApiProperty({
    description: "Downvote",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  downvote: boolean;
}
