import { IsOptional, IsString, IsArray } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class SubmitAssignmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[]
}
