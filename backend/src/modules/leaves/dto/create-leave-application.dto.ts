import { IsNotEmpty, IsNumber, IsString, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateLeaveApplicationDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  leaveTypeId: number

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string
}
