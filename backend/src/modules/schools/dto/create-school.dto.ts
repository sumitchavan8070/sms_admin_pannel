import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUrl } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateSchoolDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  website?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string
}
