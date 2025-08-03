import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { ReportsService } from "./reports.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { getUser } from "../auth/decorators/get-user.decorator"
import type { User } from "../../entities/user.entity"

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard statistics" })
  @ApiResponse({ status: 200, description: "Dashboard stats retrieved successfully" })
  async getDashboardStats(@getUser() user: User) {
    return this.reportsService.getDashboardStats(user.schoolId)
  }

  @Get("attendance/summary")
  @ApiOperation({ summary: "Get attendance summary report" })
  @ApiQuery({ name: "startDate", required: false, description: "Start date (YYYY-MM-DD)" })
  @ApiQuery({ name: "endDate", required: false, description: "End date (YYYY-MM-DD)" })
  async getAttendanceSummary(
    @getUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getAttendanceSummary(user.schoolId, startDate, endDate)
  }

  @Get("financial/summary")
  @ApiOperation({ summary: "Get financial summary report" })
  @ApiQuery({ name: "month", required: false, description: "Month (1-12)" })
  @ApiQuery({ name: "year", required: false, description: "Year" })
  async getFinancialSummary(@getUser() user: User, @Query('month') month?: number, @Query('year') year?: number) {
    return this.reportsService.getFinancialSummary(user.schoolId, month, year)
  }

  @Get("staff/performance")
  @ApiOperation({ summary: "Get staff performance report" })
  @ApiQuery({ name: "month", required: false, description: "Month (1-12)" })
  @ApiQuery({ name: "year", required: false, description: "Year" })
  async getStaffPerformance(@getUser() user: User, @Query('month') month?: number, @Query('year') year?: number) {
    return this.reportsService.getStaffPerformance(user.schoolId, month, year)
  }

  @Get("students/overview")
  @ApiOperation({ summary: "Get students overview report" })
  async getStudentsOverview(@getUser() user: User) {
    return this.reportsService.getStudentsOverview(user.schoolId)
  }
}
