import { Controller, Get, UseGuards, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import  { ReportsService } from "./reports.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import  { User } from "../../entities/user.entity"

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("dashboard-stats")
  @ApiOperation({ summary: "Get dashboard statistics" })
  getDashboardStats(currentUser: User) {
    return this.reportsService.getDashboardStats(currentUser)
  }

  @Get("attendance-summary")
  @ApiOperation({ summary: "Get attendance summary" })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  @ApiQuery({ name: "type", required: false, enum: ["staff", "student"] })
  getAttendanceSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    currentUser?: User,
  ) {
    return this.reportsService.getAttendanceSummary({ startDate, endDate, type }, currentUser)
  }

  @Get("financial-summary")
  @ApiOperation({ summary: "Get financial summary" })
  @ApiQuery({ name: "month", required: false })
  @ApiQuery({ name: "year", required: false })
  getFinancialSummary(@Query('month') month?: number, @Query('year') year?: number, currentUser?: User) {
    return this.reportsService.getFinancialSummary({ month, year }, currentUser)
  }

  @Get("staff-performance")
  @ApiOperation({ summary: "Get staff performance report" })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  getStaffPerformance(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string, currentUser?: User) {
    return this.reportsService.getStaffPerformance({ startDate, endDate }, currentUser)
  }

  @Get("student-overview")
  @ApiOperation({ summary: "Get student overview report" })
  @ApiQuery({ name: "classId", required: false })
  @ApiQuery({ name: "grade", required: false })
  getStudentOverview(@Query('classId') classId?: number, @Query('grade') grade?: string, currentUser?: User) {
    return this.reportsService.getStudentOverview({ classId, grade }, currentUser)
  }
}
