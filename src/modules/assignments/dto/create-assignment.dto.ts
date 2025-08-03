import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateAssignmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  classId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  subjectId: number

  @ApiProperty({ example: "Math Assignment 1" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "Solve the given mathematical problems" })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: "Show all working steps", required: false })
  @IsString()
  @IsOptional()
  instructions?: string

  @ApiProperty({ example: ["file1.pdf", "file2.doc"], required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[]

  @ApiProperty({ example: "2024-01-20T23:59:59Z" })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  maxMarks: number
}
