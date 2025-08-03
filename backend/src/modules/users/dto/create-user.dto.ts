import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Gender } from "@/entities/user.entity"

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @MinLength(6)
  password: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  roleId: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  schoolId: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  classId?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  joinDate?: string
}
