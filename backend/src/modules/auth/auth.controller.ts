// src/modules/auth/auth.controller.ts
import { Controller, Post, Get, Body, UseGuards, Req, HttpStatus, HttpCode } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"

import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { GetUser } from "./decorators/get-user.decorator"
import { User } from "@/entities/user.entity"
import { ok } from "assert"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }


  @Post("generate-password")
  @HttpCode(HttpStatus.OK)
   async generatePassword(@Body('password') password: string) {
    return this.authService.generateStringToPass(password);
  }


  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user profile" })
  async getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user.id)
  }

  @Get("roles")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all roles" })
  async getRoles() {
    return this.authService.getRoles()
  }

  @Get("schools")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all schools" })
  async getSchools() {
    return this.authService.getSchools()
  }
}
