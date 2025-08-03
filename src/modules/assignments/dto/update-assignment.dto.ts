import { IsString, IsNumber, IsOptional, IsArray, IsDateString, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { AssignmentStatus } from "../../../entities/assignment.entity"

export class UpdateAssignmentDto {
  @ApiProperty({ example: "Math Assignment 1 - Updated", required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ example: "Updated description", required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ example: "Updated instructions", required: false })
  @IsString()
  @IsOptional()
  instructions?: string

  @ApiProperty({ example: ["file1.pdf", "file2.doc"], required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[]

  @ApiProperty({ example: "2024-01-25T23:59:59Z", required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  maxMarks?: number

  @ApiProperty({ example: "published", enum: AssignmentStatus, required: false })
  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus
}
