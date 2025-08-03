import { Controller, Get, Post, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import  { AssignmentsService } from "./assignments.service"
import  { CreateAssignmentDto } from "./dto/create-assignment.dto"
import  { UpdateAssignmentDto } from "./dto/update-assignment.dto"
import  { SubmitAssignmentDto } from "./dto/submit-assignment.dto"
import  { GradeAssignmentDto } from "./dto/grade-assignment.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import  { User } from "@/entities/user.entity"

@ApiTags("Assignments")
@Controller("assignments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ summary: "Create assignment" })
  create(createAssignmentDto: CreateAssignmentDto, currentUser: User) {
    return this.assignmentsService.create(createAssignmentDto, currentUser)
  }

  @Get()
  @ApiOperation({ summary: "Get assignments" })
  @ApiQuery({ name: "classId", required: false })
  @ApiQuery({ name: "subjectId", required: false })
  @ApiQuery({ name: "teacherId", required: false })
  @ApiQuery({ name: "status", required: false })
  findAll(classId?: number, subjectId?: number, teacherId?: number, status?: string, currentUser?: User) {
    return this.assignmentsService.findAll({ classId, subjectId, teacherId, status }, currentUser)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get assignment by ID" })
  findOne(id: string, currentUser: User) {
    return this.assignmentsService.findOne(+id, currentUser)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update assignment" })
  update(id: string, updateAssignmentDto: UpdateAssignmentDto, currentUser: User) {
    return this.assignmentsService.update(+id, updateAssignmentDto, currentUser)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete assignment" })
  remove(id: string, currentUser: User) {
    return this.assignmentsService.remove(+id, currentUser)
  }

  @Post(":id/submit")
  @ApiOperation({ summary: "Submit assignment" })
  submitAssignment(id: string, submitAssignmentDto: SubmitAssignmentDto, currentUser: User) {
    return this.assignmentsService.submitAssignment(+id, submitAssignmentDto, currentUser)
  }

  @Patch("submissions/:submissionId/grade")
  @ApiOperation({ summary: "Grade assignment submission" })
  gradeSubmission(submissionId: string, gradeAssignmentDto: GradeAssignmentDto, currentUser: User) {
    return this.assignmentsService.gradeSubmission(+submissionId, gradeAssignmentDto, currentUser)
  }

  @Get(":id/submissions")
  @ApiOperation({ summary: "Get assignment submissions" })
  getSubmissions(id: string, currentUser: User) {
    return this.assignmentsService.getSubmissions(+id, currentUser)
  }

  @Get("my/submissions")
  @ApiOperation({ summary: "Get my assignment submissions" })
  getMySubmissions(currentUser: User) {
    return this.assignmentsService.getMySubmissions(currentUser)
  }
}
