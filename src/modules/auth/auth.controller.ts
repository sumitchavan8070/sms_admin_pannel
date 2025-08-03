import { Controller, Post, HttpCode, HttpStatus, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import  { AuthService } from "./auth.service"
import  { LoginDto } from "./dto/login.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { GetUser } from "./decorators/get-user.decorator"
import  { User } from "../../entities/user.entity"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@GetUser() user: User) {
    return {
      status: 1,
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role.name,
        school: user.school.name,
        department: user.department,
        designation: user.designation,
      },
    };
  }

  @Get("roles")
  @ApiOperation({ summary: "Get all roles" })
  @ApiResponse({ status: 200, description: "Roles fetched successfully" })
  async getRoles() {
    return this.authService.getRoles()
  }

  @Get("schools")
  @ApiOperation({ summary: "Get all schools" })
  @ApiResponse({ status: 200, description: "Schools fetched successfully" })
  async getSchools() {
    return this.authService.getSchools()
  }
}
