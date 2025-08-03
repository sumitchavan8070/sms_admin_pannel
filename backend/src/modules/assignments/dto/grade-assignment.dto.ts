import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class GradeAssignmentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  marks: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedback?: string
}
