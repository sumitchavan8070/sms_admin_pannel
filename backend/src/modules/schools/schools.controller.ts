import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import  { SchoolsService } from "./schools.service"
import  { CreateSchoolDto } from "./dto/create-school.dto"
import  { UpdateSchoolDto } from "./dto/update-school.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { GetUser } from "../auth/decorators/get-user.decorator"
import  { User } from "@/entities/user.entity" 

@ApiTags("Schools")
@Controller("schools")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post("create-new-school")
  @ApiOperation({ summary: "Create a new school" })
  @ApiResponse({ status: 201, description: "School created successfully" })
  create(@Body() createSchoolDto: CreateSchoolDto, @GetUser() currentUser: User) {
    return this.schoolsService.create(createSchoolDto, currentUser)
  }

  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  findAll(@GetUser() currentUser: User) {
    return this.schoolsService.findAll(currentUser)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get school by ID" })
  findOne(@Param('id') id: string, @GetUser() currentUser: User) {
    return this.schoolsService.findOne(+id, currentUser)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update school" })
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto, @GetUser() currentUser: User) {
    return this.schoolsService.update(+id, updateSchoolDto, currentUser)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete school" })
  remove(@Param('id') id: string, @GetUser() currentUser: User) {
    return this.schoolsService.remove(+id, currentUser)
  }
}
