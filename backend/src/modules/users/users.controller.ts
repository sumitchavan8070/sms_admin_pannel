import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards, Body, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { GetUser } from "../auth/decorators/get-user.decorator"
import { User } from "../../entities/user.entity"

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  
  @Post("create-new-user")
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  create(@Body() createUserDto: CreateUserDto, @GetUser() user: User) {
    return this.usersService.create(createUserDto, user)
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
  findAll(
    @Query('role') role?: string,
    @Query('school') school?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetUser() user?: User,
  ) {
    return this.usersService.findAll({ role, school, page, limit }, user)
  }

  @Get("get-user-by-id")
  @ApiOperation({ summary: "Get user by ID" })
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.usersService.findOne(+id, user)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user" })
  update(@Param('id') id: string, updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.usersService.update(+id, updateUserDto, user)
  }

  @Post("delete-user")
  @ApiOperation({ summary: "Delete user by ID (from body)" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  remove(@Body('id') id: number, @Req() req: Request, @GetUser() user: User) {
    return this.usersService.remove(id, user);
  }


  @Get("role/students")
  @ApiOperation({ summary: "Get all students" })
  getStudents(@GetUser() user: User) {
    return this.usersService.getStudents(user)
  }

  @Get("role/teachers")
  @ApiOperation({ summary: "Get all teachers" })
  getTeachers(@GetUser() user: User) {
    return this.usersService.getTeachers(user)
  }

  @Get("role/staff")
  @ApiOperation({ summary: "Get all staff" })
  getStaff(@GetUser() user: User) {
    return this.usersService.getStaff(user)
  }
}
