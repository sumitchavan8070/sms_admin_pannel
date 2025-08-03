import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateTimetableDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  classId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  subjectId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  teacherId: number

  @ApiProperty({
    example: "monday",
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  })
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string

  @ApiProperty({ example: "09:00" })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ example: "10:00" })
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ example: "Room 101", required: false })
  @IsString()
  @IsOptional()
  room?: string
}
