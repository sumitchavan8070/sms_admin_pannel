import { Controller, Get, Post, Put, Body, Query, UseGuards, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { LeavesService } from "./leaves.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { User } from "../../entities/user.entity"
import type { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto"
import type { ApproveLeaveDto } from "./dto/approve-leave.dto"

@ApiTags("Leaves")
@Controller("leaves")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get("types")
  @ApiOperation({ summary: "Get all leave types" })
  @ApiResponse({ status: 200, description: "Leave types retrieved successfully" })
  async getLeaveTypes(user: User) {
    return this.leavesService.getLeaveTypes(user.schoolId)
  }

  @Get("staff/pending")
  @ApiOperation({ summary: "Get pending staff leave applications" })
  @ApiResponse({ status: 200, description: "Pending leave applications retrieved successfully" })
  async getPendingStaffLeaves(user: User) {
    return this.leavesService.getPendingStaffLeaves(user.schoolId)
  }

  @Get("students/pending")
  @ApiOperation({ summary: "Get pending student leave applications" })
  @ApiResponse({ status: 200, description: "Pending student leave applications retrieved successfully" })
  async getPendingStudentLeaves(user: User) {
    return this.leavesService.getPendingStudentLeaves(user.schoolId)
  }

  @Post("staff/apply")
  @ApiOperation({ summary: "Apply for staff leave" })
  @ApiResponse({ status: 201, description: "Leave application submitted successfully" })
  async applyStaffLeave(user: User, @Body() createLeaveApplicationDto: CreateLeaveApplicationDto) {
    return this.leavesService.applyStaffLeave(user, createLeaveApplicationDto)
  }

  @Post("students/apply")
  @ApiOperation({ summary: "Apply for student leave" })
  @ApiResponse({ status: 201, description: "Student leave application submitted successfully" })
  async applyStudentLeave(user: User, @Body() createLeaveApplicationDto: CreateLeaveApplicationDto) {
    return this.leavesService.applyStudentLeave(user, createLeaveApplicationDto)
  }

  @Put("staff/:leaveId/approve")
  @ApiOperation({ summary: "Approve or reject staff leave application" })
  @ApiResponse({ status: 200, description: "Leave application processed successfully" })
  async approveStaffLeave(user: User, @Param('leaveId') leaveId: number, @Body() approveLeaveDto: ApproveLeaveDto) {
    return this.leavesService.approveStaffLeave(user, leaveId, approveLeaveDto)
  }

  @Put("students/:leaveId/approve")
  @ApiOperation({ summary: "Approve or reject student leave application" })
  @ApiResponse({ status: 200, description: "Student leave application processed successfully" })
  async approveStudentLeave(user: User, @Param('leaveId') leaveId: number, @Body() approveLeaveDto: ApproveLeaveDto) {
    return this.leavesService.approveStudentLeave(user, leaveId, approveLeaveDto)
  }

  @Get("staff/history")
  @ApiOperation({ summary: "Get staff leave history" })
  async getStaffLeaveHistory(user: User, @Query('staffId') staffId?: number) {
    return this.leavesService.getStaffLeaveHistory(user.schoolId, staffId || user.id)
  }
}
