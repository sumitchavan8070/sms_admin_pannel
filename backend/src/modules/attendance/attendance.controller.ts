import { Controller, Get, Post, Query, UseGuards, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import  { AttendanceService } from "./attendance.service"
import  { MarkAttendanceDto } from "./dto/mark-attendance.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import  { User } from "@/entities/user.entity"

@ApiTags("Attendance")
@Controller("v1/attendance")
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("staff")
  @ApiOperation({ summary: "Mark staff attendance" })
  markStaffAttendance(markAttendanceDto: MarkAttendanceDto, currentUser: User) {
    return this.attendanceService.markStaffAttendance(markAttendanceDto, currentUser)
  }

  @Post("student")
  @ApiOperation({ summary: "Mark student attendance" })
  markStudentAttendance(markAttendanceDto: MarkAttendanceDto, currentUser: User) {
    return this.attendanceService.markStudentAttendance(markAttendanceDto, currentUser)
  }

  @Get("get-staff-attendance")
  @ApiOperation({ summary: "Get staff attendance" })
  getStaffAttendance(@Query('date') date?: string, @Query('staffId') staffId?: number, currentUser?: User) {
    return this.attendanceService.getStaffAttendance({ date, staffId }, currentUser)
  }

  @Get("student")
  @ApiOperation({ summary: "Get student attendance" })
  getStudentAttendance(
    @Query('date') date?: string,
    @Query('studentId') studentId?: number,
    @Query('classId') classId?: number,
    currentUser?: User,
  ) {
    return this.attendanceService.getStudentAttendance({ date, studentId, classId }, currentUser)
  }

  @Get("staff/:id")
  @ApiOperation({ summary: "Get staff attendance by ID" })
  getStaffAttendanceById(@Param('id') id: string, currentUser: User) {
    return this.attendanceService.getStaffAttendanceById(+id, currentUser)
  }

  @Get("student/:id")
  @ApiOperation({ summary: "Get student attendance by ID" })
  getStudentAttendanceById(@Param('id') id: string, currentUser: User) {
    return this.attendanceService.getStudentAttendanceById(+id, currentUser)
  }
}
