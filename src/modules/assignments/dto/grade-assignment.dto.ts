import { IsNumber, IsString, IsOptional, Min, Max } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class GradeAssignmentDto {
  @ApiProperty({ example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  marks: number

  @ApiProperty({ example: "Good work! Consider improving...", required: false })
  @IsString()
  @IsOptional()
  feedback?: string
}
