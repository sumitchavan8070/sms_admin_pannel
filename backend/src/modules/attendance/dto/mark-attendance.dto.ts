import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { AttendanceStatus } from "@/entities/staff-attendance.entity"
import { StudentAttendanceStatus } from "@/entities/student-attendance.entity"

export class MarkAttendanceDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: string

  @ApiProperty({ enum: [...Object.values(AttendanceStatus), ...Object.values(StudentAttendanceStatus)] })
  @IsString()
  @IsNotEmpty()
  status: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  checkInTime?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  checkOutTime?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  subjectId?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string
}
