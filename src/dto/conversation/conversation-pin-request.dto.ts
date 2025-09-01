import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class ConversationPinRequestDTO {
  @ApiProperty({
    description: "Whether the conversation is pinned",
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_pinned: boolean;
}
