import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { TimetableService } from "./timetable.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { CreateTimetableDto } from "./dto/create-timetable.dto"
import type { UpdateTimetableDto } from "./dto/update-timetable.dto"

@ApiTags("Timetable")
@Controller("timetable")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  @ApiOperation({ summary: "Get timetable" })
  @ApiQuery({ name: "classId", required: false, description: "Filter by class ID" })
  @ApiQuery({ name: "teacherId", required: false, description: "Filter by teacher ID" })
  @ApiQuery({ name: "dayOfWeek", required: false, description: "Filter by day of week" })
  async getTimetable(
    @Query('classId') classId?: number,
    @Query('teacherId') teacherId?: number,
    @Query('dayOfWeek') dayOfWeek?: string,
  ) {
    const user = { schoolId: 1 } // Placeholder for user object retrieval logic
    return this.timetableService.getTimetable(user.schoolId, { classId, teacherId, dayOfWeek })
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get timetable for specific class' })
  async getClassTimetable(@Param('classId') classId: number) {
    const user = { schoolId: 1 }; // Placeholder for user object retrieval logic
    return this.timetableService.getClassTimetable(user.schoolId, classId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get timetable for specific teacher' })
  async getTeacherTimetable(@Param('teacherId') teacherId: number) {
    const user = { schoolId: 1 }; // Placeholder for user object retrieval logic
    return this.timetableService.getTeacherTimetable(user.schoolId, teacherId);
  }

  @Post()
  @ApiOperation({ summary: 'Create timetable entry' })
  @ApiResponse({ status: 201, description: 'Timetable entry created successfully' })
  async createTimetableEntry(@Body() createTimetableDto: CreateTimetableDto) {
    const user = { schoolId: 1 }; // Placeholder for user object retrieval logic
    return this.timetableService.createTimetableEntry(user.schoolId, createTimetableDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update timetable entry" })
  @ApiResponse({ status: 200, description: "Timetable entry updated successfully" })
  async updateTimetableEntry(@Param('id') id: number, @Body() updateTimetableDto: UpdateTimetableDto) {
    return this.timetableService.updateTimetableEntry(id, updateTimetableDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete timetable entry' })
  @ApiResponse({ status: 200, description: 'Timetable entry deleted successfully' })
  async deleteTimetableEntry(@Param('id') id: number) {
    return this.timetableService.deleteTimetableEntry(id);
  }
}
