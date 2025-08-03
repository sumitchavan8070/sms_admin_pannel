import { IsNumber, IsString, IsOptional, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateTimetableDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  classId?: number

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  subjectId?: number

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  teacherId?: number

  @ApiProperty({
    example: "monday",
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    required: false,
  })
  @IsString()
  @IsOptional()
  dayOfWeek?: string

  @ApiProperty({ example: "09:00", required: false })
  @IsString()
  @IsOptional()
  startTime?: string

  @ApiProperty({ example: "10:00", required: false })
  @IsString()
  @IsOptional()
  endTime?: string

  @ApiProperty({ example: "Room 101", required: false })
  @IsString()
  @IsOptional()
  room?: string

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
