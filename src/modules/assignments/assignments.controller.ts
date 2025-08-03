import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { AssignmentsService } from "./assignments.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { User } from "../../entities/user.entity"
import type { CreateAssignmentDto } from "./dto/create-assignment.dto"
import type { UpdateAssignmentDto } from "./dto/update-assignment.dto"
import type { SubmitAssignmentDto } from "./dto/submit-assignment.dto"
import type { GradeAssignmentDto } from "./dto/grade-assignment.dto"

@ApiTags("Assignments")
@Controller("assignments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({ summary: "Get assignments" })
  @ApiQuery({ name: "classId", required: false, description: "Filter by class ID" })
  @ApiQuery({ name: "subjectId", required: false, description: "Filter by subject ID" })
  @ApiQuery({ name: "status", required: false, description: "Filter by status" })
  async getAssignments(
    @Query('classId') classId?: number,
    @Query('subjectId') subjectId?: number,
    @Query('status') status?: string,
  ) {
    const user = this.getUserFromRequest() // Placeholder for getting user from request
    return this.assignmentsService.getAssignments(user, { classId, subjectId, status })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  async getAssignmentById(@Param('id') id: number) {
    const user = this.getUserFromRequest(); // Placeholder for getting user from request
    return this.assignmentsService.getAssignmentById(user.schoolId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    const user = this.getUserFromRequest(); // Placeholder for getting user from request
    return this.assignmentsService.createAssignment(user, createAssignmentDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update assignment" })
  async updateAssignment(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    const user = this.getUserFromRequest() // Placeholder for getting user from request
    return this.assignmentsService.updateAssignment(user.schoolId, id, updateAssignmentDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete assignment' })
  async deleteAssignment(@Param('id') id: number) {
    const user = this.getUserFromRequest(); // Placeholder for getting user from request
    return this.assignmentsService.deleteAssignment(user.schoolId, id);
  }

  @Post(":id/submit")
  @ApiOperation({ summary: "Submit assignment" })
  async submitAssignment(@Param('id') id: number, @Body() submitAssignmentDto: SubmitAssignmentDto) {
    const user = this.getUserFromRequest() // Placeholder for getting user from request
    return this.assignmentsService.submitAssignment(user, id, submitAssignmentDto)
  }

  @Get(':id/submissions')
  @ApiOperation({ summary: 'Get assignment submissions' })
  async getAssignmentSubmissions(@Param('id') id: number) {
    const user = this.getUserFromRequest(); // Placeholder for getting user from request
    return this.assignmentsService.getAssignmentSubmissions(user.schoolId, id);
  }

  @Put("submissions/:submissionId/grade")
  @ApiOperation({ summary: "Grade assignment submission" })
  async gradeSubmission(@Param('submissionId') submissionId: number, @Body() gradeAssignmentDto: GradeAssignmentDto) {
    const user = this.getUserFromRequest() // Placeholder for getting user from request
    return this.assignmentsService.gradeSubmission(user, submissionId, gradeAssignmentDto)
  }

  private getUserFromRequest(): User {
    // Placeholder implementation for getting user from request
    return { schoolId: 1 } as User // Replace with actual logic to get user
  }
}
