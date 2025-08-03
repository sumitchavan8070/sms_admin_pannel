import { IsEmail, IsString, IsNumber, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UserStatus } from "../../../entities/user.entity"

export class UpdateUserDto {
  @ApiProperty({ example: "john.doe@school.com", required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ example: "John", required: false })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({ example: "Doe", required: false })
  @IsString()
  @IsOptional()
  lastName?: string

  @ApiProperty({ example: "+1234567890", required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ example: "123 Main St", required: false })
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty({ example: "Mathematics", required: false })
  @IsString()
  @IsOptional()
  department?: string

  @ApiProperty({ example: "Senior Teacher", required: false })
  @IsString()
  @IsOptional()
  designation?: string

  @ApiProperty({ example: 55000, required: false })
  @IsNumber()
  @IsOptional()
  salary?: number

  @ApiProperty({ example: "active", enum: UserStatus, required: false })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus
}
