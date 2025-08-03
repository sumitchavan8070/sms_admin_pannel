import { IsNotEmpty, IsString, IsOptional, IsEmail } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateSchoolDto {
  @ApiProperty({ example: "Springfield Elementary School" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "123 Main Street, Springfield", required: false })
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty({ example: "+1234567890", required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ example: "info@springfield.edu", required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ example: "https://springfield.edu", required: false })
  @IsString()
  @IsOptional()
  website?: string

  @ApiProperty({ example: "https://example.com/logo.png", required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string

  @ApiProperty({ example: "A premier educational institution", required: false })
  @IsString()
  @IsOptional()
  description?: string
}
