import { Controller, Get, Post, Body, Query, UseGuards, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { AttendanceService } from "./attendance.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { User } from "../../entities/user.entity"
import type { MarkAttendanceDto } from "./dto/mark-attendance.dto"

@ApiTags("Attendance")
@Controller("attendance")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get("staff/today")
  @ApiOperation({ summary: "Get today's staff attendance" })
  @ApiResponse({ status: 200, description: "Staff attendance retrieved successfully" })
  async getTodayStaffAttendance(user: User) {
    return this.attendanceService.getTodayStaffAttendance(user.schoolId)
  }

  @Get("students/today")
  @ApiOperation({ summary: "Get today's student attendance by class" })
  @ApiResponse({ status: 200, description: "Student attendance retrieved successfully" })
  async getTodayStudentAttendance(user: User) {
    return this.attendanceService.getTodayStudentAttendance(user.schoolId)
  }

  @Get("staff/stats")
  @ApiOperation({ summary: "Get staff attendance statistics" })
  @ApiQuery({ name: "date", required: false, description: "Date in YYYY-MM-DD format" })
  async getStaffAttendanceStats(user: User, @Query('date') date?: string) {
    return this.attendanceService.getStaffAttendanceStats(user.schoolId, date)
  }

  @Get("students/stats")
  @ApiOperation({ summary: "Get student attendance statistics" })
  @ApiQuery({ name: "date", required: false, description: "Date in YYYY-MM-DD format" })
  async getStudentAttendanceStats(user: User, @Query('date') date?: string) {
    return this.attendanceService.getStudentAttendanceStats(user.schoolId, date)
  }

  @Post("staff/mark")
  @ApiOperation({ summary: "Mark staff attendance" })
  @ApiResponse({ status: 201, description: "Attendance marked successfully" })
  async markStaffAttendance(user: User, @Body() markAttendanceDto: MarkAttendanceDto) {
    return this.attendanceService.markStaffAttendance(user, markAttendanceDto)
  }

  @Get("staff/history/:staffId")
  @ApiOperation({ summary: "Get staff attendance history" })
  @ApiQuery({ name: "month", required: false, description: "Month (1-12)" })
  @ApiQuery({ name: "year", required: false, description: "Year" })
  async getStaffAttendanceHistory(
    user: User,
    @Param('staffId') staffId: number,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.attendanceService.getStaffAttendanceHistory(user.schoolId, staffId, month, year)
  }
}
