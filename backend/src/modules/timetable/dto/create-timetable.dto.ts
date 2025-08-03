import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { DayOfWeek } from "@/entities/timetable.entity"

export class CreateTimetableDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  classId: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  subjectId: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  teacherId: number

  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  room?: string
}
