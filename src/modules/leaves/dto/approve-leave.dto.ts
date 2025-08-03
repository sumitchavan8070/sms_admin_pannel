import { IsNotEmpty, IsString, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ApproveLeaveDto {
  @ApiProperty({ example: "approved", enum: ["approved", "rejected"] })
  @IsString()
  @IsNotEmpty()
  status: string

  @ApiProperty({ example: "Not enough leave balance", required: false })
  @IsString()
  @IsOptional()
  rejectionReason?: string
}
