import { Controller, Get, Post, Put, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { SchoolsService } from "./schools.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { CreateSchoolDto } from "./dto/create-school.dto"
import type { UpdateSchoolDto } from "./dto/update-school.dto"

@ApiTags("Schools")
@Controller("schools")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}  // <- THIS is the index [0]

  @Get()
  @ApiOperation({ summary: "Get all schools" })
  @ApiResponse({ status: 200, description: "Schools retrieved successfully" })
  async getSchools() {
    return this.schoolsService.getSchools()
  }

  @Get(":id")
  @ApiOperation({ summary: "Get school by ID" })
  @ApiResponse({ status: 200, description: "School retrieved successfully" })
  @ApiResponse({ status: 404, description: "School not found" })
  async getSchoolById(id: number) {
    return this.schoolsService.getSchoolById(id)
  }

  @Post()
  @ApiOperation({ summary: "Create new school" })
  @ApiResponse({ status: 201, description: "School created successfully" })
  async createSchool(createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.createSchool(createSchoolDto)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update school" })
  @ApiResponse({ status: 200, description: "School updated successfully" })
  @ApiResponse({ status: 404, description: "School not found" })
  async updateSchool(id: number, updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.updateSchool(id, updateSchoolDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete school" })
  @ApiResponse({ status: 200, description: "School deleted successfully" })
  @ApiResponse({ status: 404, description: "School not found" })
  async deleteSchool(id: number) {
    return this.schoolsService.deleteSchool(id)
  }

  @Get(":id/settings")
  @ApiOperation({ summary: "Get school settings" })
  async getSchoolSettings(id: number) {
    return this.schoolsService.getSchoolSettings(id)
  }

  @Put(":id/settings")
  @ApiOperation({ summary: "Update school settings" })
  async updateSchoolSettings(id: number, settings: any) {
    return this.schoolsService.updateSchoolSettings(id, settings)
  }
}
