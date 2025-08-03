import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NotificationType, NotificationPriority } from "@/entities/notification.entity"

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string

  @ApiProperty({ enum: NotificationType, required: false })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType

  @ApiProperty({ enum: NotificationPriority, required: false })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  recipientIds: number[]

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string
}
