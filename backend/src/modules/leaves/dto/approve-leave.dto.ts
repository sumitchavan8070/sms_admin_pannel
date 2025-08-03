import { IsNotEmpty, IsString, IsEnum, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { LeaveStatus } from "@/entities/staff-leave-application.entity"

export class ApproveLeaveDto {
  @ApiProperty({ enum: LeaveStatus })
  @IsEnum(LeaveStatus)
  @IsNotEmpty()
  status: LeaveStatus

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string
}
