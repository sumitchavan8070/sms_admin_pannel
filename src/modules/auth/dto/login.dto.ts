import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @ApiProperty({ example: "admin@school.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: "password123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({ example: "1" })
  @IsString()
  @IsNotEmpty()
  schoolId: string

  @ApiProperty({ example: "1" })
  @IsString()
  @IsNotEmpty()
  roleId: string
}
