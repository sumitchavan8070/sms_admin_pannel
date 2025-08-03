import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateLeaveApplicationDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  studentId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  leaveTypeId: number

  @ApiProperty({ example: "2024-01-15" })
  @IsDateString()
  @IsNotEmpty()
  startDate: string

  @ApiProperty({ example: "2024-01-17" })
  @IsDateString()
  @IsNotEmpty()
  endDate: string

  @ApiProperty({ example: "Medical appointment" })
  @IsString()
  @IsNotEmpty()
  reason: string

  @ApiProperty({ example: "medical-cert.pdf", required: false })
  @IsString()
  @IsOptional()
  medicalCertificate?: string
}
