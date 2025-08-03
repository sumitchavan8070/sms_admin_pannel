import { Controller, Get, Post, Patch, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import  { LeavesService } from "./leaves.service"
import  { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto"
import  { ApproveLeaveDto } from "./dto/approve-leave.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import  { User } from "@/entities/user.entity"

@ApiTags("Leaves")
@Controller("leaves")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post("staff")
  @ApiOperation({ summary: "Apply for staff leave" })
  applyStaffLeave(createLeaveApplicationDto: CreateLeaveApplicationDto, currentUser: User) {
    return this.leavesService.applyStaffLeave(createLeaveApplicationDto, currentUser)
  }

  @Post("student")
  @ApiOperation({ summary: "Apply for student leave" })
  applyStudentLeave(createLeaveApplicationDto: CreateLeaveApplicationDto, currentUser: User) {
    return this.leavesService.applyStudentLeave(createLeaveApplicationDto, currentUser)
  }

  @Get("staff")
  @ApiOperation({ summary: "Get staff leave applications" })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "staffId", required: false })
  getStaffLeaves(status?: string, staffId?: number, currentUser?: User) {
    return this.leavesService.getStaffLeaves({ status, staffId }, currentUser)
  }

  @Get("student")
  @ApiOperation({ summary: "Get student leave applications" })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "studentId", required: false })
  getStudentLeaves(status?: string, studentId?: number, currentUser?: User) {
    return this.leavesService.getStudentLeaves({ status, studentId }, currentUser)
  }

  @Patch("staff/:id/approve")
  @ApiOperation({ summary: "Approve/reject staff leave" })
  approveStaffLeave(id: string, approveLeaveDto: ApproveLeaveDto, currentUser: User) {
    return this.leavesService.approveStaffLeave(+id, approveLeaveDto, currentUser)
  }

  @Patch("student/:id/approve")
  @ApiOperation({ summary: "Approve/reject student leave" })
  approveStudentLeave(id: string, approveLeaveDto: ApproveLeaveDto, currentUser: User) {
    return this.leavesService.approveStudentLeave(+id, approveLeaveDto, currentUser)
  }

  @Get("types")
  @ApiOperation({ summary: "Get leave types" })
  getLeaveTypes() {
    return this.leavesService.getLeaveTypes()
  }
}
