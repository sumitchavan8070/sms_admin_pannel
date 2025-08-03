import { Controller, Get, Post, Put, Delete, Body, Query, UseGuards, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { UsersService } from "./users.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users with filters" })
  @ApiQuery({ name: "role", required: false, description: "Filter by role name" })
  @ApiQuery({ name: "department", required: false, description: "Filter by department" })
  @ApiQuery({ name: "search", required: false, description: "Search by name or email" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  async getUsers(
    @Query('role') role?: string,
    @Query('department') department?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const user = this.usersService.getCurrentUser()
    return this.usersService.getUsers(user.schoolId, { role, department, search, page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserById(@Param('id') id: number) {
    const user = this.usersService.getCurrentUser();
    return this.usersService.getUserById(user.schoolId, id)
  }

  @Post()
  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.getCurrentUser();
    return this.usersService.createUser(user, createUserDto)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.getCurrentUser()
    return this.usersService.updateUser(user.schoolId, id, updateUserDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteUser(@Param('id') id: number) {
    const user = this.usersService.getCurrentUser();
    return this.usersService.deleteUser(user.schoolId, id)
  }

  @Get("staff/list")
  @ApiOperation({ summary: "Get all staff members" })
  async getStaffList() {
    const user = this.usersService.getCurrentUser()
    return this.usersService.getStaffList(user.schoolId)
  }

  @Get("students/list")
  @ApiOperation({ summary: "Get all students" })
  async getStudentsList() {
    const user = this.usersService.getCurrentUser()
    return this.usersService.getStudentsList(user.schoolId)
  }
}
