import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class MarkAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  staffId: number

  @ApiProperty({ example: "2024-01-15" })
  @IsDateString()
  @IsNotEmpty()
  date: string

  @ApiProperty({ example: "present", enum: ["present", "absent", "late", "half_day"] })
  @IsString()
  @IsNotEmpty()
  status: string

  @ApiProperty({ example: "09:00", required: false })
  @IsString()
  @IsOptional()
  checkInTime?: string

  @ApiProperty({ example: "17:00", required: false })
  @IsString()
  @IsOptional()
  checkOutTime?: string

  @ApiProperty({ example: "Late due to traffic", required: false })
  @IsString()
  @IsOptional()
  notes?: string
}
