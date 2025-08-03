import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsArray } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateAssignmentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  subjectId: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  classId: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instructions?: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dueDate: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxMarks?: number

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[]
}
