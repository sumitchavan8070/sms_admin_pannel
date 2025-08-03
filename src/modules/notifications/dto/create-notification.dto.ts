import { IsNotEmpty, IsString, IsOptional, IsArray, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NotificationType, NotificationPriority } from "../../../entities/notification.entity"

export class CreateNotificationDto {
  @ApiProperty({ example: "Important Announcement" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "This is an important message for all users." })
  @IsString()
  @IsNotEmpty()
  message: string

  @ApiProperty({ example: "general", enum: NotificationType })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType

  @ApiProperty({ example: "medium", enum: NotificationPriority, required: false })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority

  @ApiProperty({ example: ["Teacher", "Student"], required: false })
  @IsArray()
  @IsOptional()
  targetRoles?: string[]

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsArray()
  @IsOptional()
  targetUsers?: number[]
}
