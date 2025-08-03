import { IsEmail, IsNotEmpty, IsString, IsNumber, IsOptional, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({ example: "john.doe@school.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({ example: 4 })
  @IsNumber()
  @IsNotEmpty()
  roleId: number

  @ApiProperty({ example: "+1234567890", required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ example: "Mathematics", required: false })
  @IsString()
  @IsOptional()
  department?: string

  @ApiProperty({ example: "Senior Teacher", required: false })
  @IsString()
  @IsOptional()
  designation?: string

  @ApiProperty({ example: 50000, required: false })
  @IsNumber()
  @IsOptional()
  salary?: number

  @ApiProperty({ example: "password123", required: false })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string
}
