import { IsString, IsOptional, IsArray } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class SubmitAssignmentDto {
  @ApiProperty({ example: "My assignment solution...", required: false })
  @IsString()
  @IsOptional()
  content?: string

  @ApiProperty({ example: ["solution.pdf", "workings.doc"], required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[]
}
