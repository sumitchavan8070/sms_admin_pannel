import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Assignment, AssignmentStatus } from "../../entities/assignment.entity"
import { type AssignmentSubmission, SubmissionStatus } from "../../entities/assignment-submission.entity"
import type { Class } from "../../entities/class.entity"
import type { Subject } from "../../entities/subject.entity"
import type { User } from "../../entities/user.entity"
import type { CreateAssignmentDto } from "./dto/create-assignment.dto"
import type { UpdateAssignmentDto } from "./dto/update-assignment.dto"
import type { SubmitAssignmentDto } from "./dto/submit-assignment.dto"
import type { GradeAssignmentDto } from "./dto/grade-assignment.dto"

interface AssignmentFilters {
  classId?: number
  subjectId?: number
  status?: string
}

@Injectable()
export class AssignmentsService {
  private assignmentRepository: Repository<Assignment>
  private submissionRepository: Repository<AssignmentSubmission>
  private classRepository: Repository<Class>
  private subjectRepository: Repository<Subject>
  private userRepository: Repository<User>

  constructor(
    assignmentRepository: Repository<Assignment>,
    submissionRepository: Repository<AssignmentSubmission>,
    classRepository: Repository<Class>,
    subjectRepository: Repository<Subject>,
    userRepository: Repository<User>,
  ) {
    this.assignmentRepository = assignmentRepository
    this.submissionRepository = submissionRepository
    this.classRepository = classRepository
    this.subjectRepository = subjectRepository
    this.userRepository = userRepository
  }

  async getAssignments(user: User, filters: AssignmentFilters) {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder("assignment")
      .leftJoinAndSelect("assignment.class", "class")
      .leftJoinAndSelect("assignment.subject", "subject")
      .leftJoinAndSelect("assignment.teacher", "teacher")
      .where("assignment.schoolId = :schoolId", { schoolId: user.schoolId })

    // Role-based filtering
    if (user.roleId === 4) {
      // Teacher
      queryBuilder.andWhere("assignment.teacherId = :teacherId", { teacherId: user.id })
    } else if (user.roleId === 5) {
      // Student
      // Students see assignments for their classes
      queryBuilder.andWhere("assignment.status = :status", { status: AssignmentStatus.PUBLISHED })
    }

    if (filters.classId) {
      queryBuilder.andWhere("assignment.classId = :classId", { classId: filters.classId })
    }

    if (filters.subjectId) {
      queryBuilder.andWhere("assignment.subjectId = :subjectId", { subjectId: filters.subjectId })
    }

    if (filters.status) {
      queryBuilder.andWhere("assignment.status = :status", { status: filters.status })
    }

    const assignments = await queryBuilder.orderBy("assignment.dueDate", "ASC").getMany()

    return {
      status: 1,
      message: "Assignments retrieved successfully",
      data: assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        className: `${assignment.class.name} ${assignment.class.section || ""}`.trim(),
        subjectName: assignment.subject.name,
        teacherName: assignment.teacher.fullName,
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
        status: assignment.status,
        createdAt: assignment.createdAt,
      })),
    }
  }

  async getAssignmentById(schoolId: number, id: number) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id, schoolId },
      relations: ["class", "subject", "teacher", "submissions", "submissions.student"],
    })

    if (!assignment) {
      throw new NotFoundException("Assignment not found")
    }

    return {
      status: 1,
      message: "Assignment retrieved successfully",
      data: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        instructions: assignment.instructions,
        attachments: assignment.attachments,
        className: `${assignment.class.name} ${assignment.class.section || ""}`.trim(),
        subjectName: assignment.subject.name,
        teacherName: assignment.teacher.fullName,
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
        status: assignment.status,
        createdAt: assignment.createdAt,
        submissionCount: assignment.submissions.length,
      },
    }
  }

  async createAssignment(user: User, createAssignmentDto: CreateAssignmentDto) {
    const { classId, subjectId, title, description, instructions, attachments, dueDate, maxMarks } = createAssignmentDto

    // Validate class and subject
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, schoolId: user.schoolId },
    })

    if (!classEntity) {
      throw new NotFoundException("Class not found")
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId, schoolId: user.schoolId },
    })

    if (!subject) {
      throw new NotFoundException("Subject not found")
    }

    const assignment = this.assignmentRepository.create({
      schoolId: user.schoolId,
      classId,
      subjectId,
      teacherId: user.id,
      title,
      description,
      instructions,
      attachments,
      dueDate: new Date(dueDate),
      maxMarks,
    })

    await this.assignmentRepository.save(assignment)

    return {
      status: 1,
      message: "Assignment created successfully",
      data: assignment,
    }
  }

  async updateAssignment(schoolId: number, id: number, updateAssignmentDto: UpdateAssignmentDto) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id, schoolId },
    })

    if (!assignment) {
      throw new NotFoundException("Assignment not found")
    }

    Object.assign(assignment, updateAssignmentDto)

    if (updateAssignmentDto.dueDate) {
      assignment.dueDate = new Date(updateAssignmentDto.dueDate)
    }

    await this.assignmentRepository.save(assignment)

    return {
      status: 1,
      message: "Assignment updated successfully",
      data: assignment,
    }
  }

  async deleteAssignment(schoolId: number, id: number) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id, schoolId },
    })

    if (!assignment) {
      throw new NotFoundException("Assignment not found")
    }

    await this.assignmentRepository.delete(id)

    return {
      status: 1,
      message: "Assignment deleted successfully",
    }
  }

  async submitAssignment(user: User, assignmentId: number, submitAssignmentDto: SubmitAssignmentDto) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId, schoolId: user.schoolId },
    })

    if (!assignment) {
      throw new NotFoundException("Assignment not found")
    }

    if (assignment.status !== AssignmentStatus.PUBLISHED) {
      throw new ForbiddenException("Assignment is not available for submission")
    }

    if (new Date() > assignment.dueDate) {
      throw new ForbiddenException("Assignment submission deadline has passed")
    }

    // Check if already submitted
    const existingSubmission = await this.submissionRepository.findOne({
      where: { assignmentId, studentId: user.id },
    })

    if (existingSubmission) {
      // Update existing submission
      Object.assign(existingSubmission, submitAssignmentDto)
      existingSubmission.status = SubmissionStatus.SUBMITTED
      await this.submissionRepository.save(existingSubmission)

      return {
        status: 1,
        message: "Assignment submission updated successfully",
        data: existingSubmission,
      }
    } else {
      // Create new submission
      const submission = this.submissionRepository.create({
        assignmentId,
        studentId: user.id,
        ...submitAssignmentDto,
      })

      await this.submissionRepository.save(submission)

      return {
        status: 1,
        message: "Assignment submitted successfully",
        data: submission,
      }
    }
  }

  async getAssignmentSubmissions(schoolId: number, assignmentId: number) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId, schoolId },
    })

    if (!assignment) {
      throw new NotFoundException("Assignment not found")
    }

    const submissions = await this.submissionRepository.find({
      where: { assignmentId },
      relations: ["student"],
      order: { submittedAt: "DESC" },
    })

    return {
      status: 1,
      message: "Assignment submissions retrieved successfully",
      data: {
        assignment: {
          id: assignment.id,
          title: assignment.title,
          maxMarks: assignment.maxMarks,
        },
        submissions: submissions.map((submission) => ({
          id: submission.id,
          studentName: submission.student.fullName,
          studentId: submission.student.studentId,
          content: submission.content,
          attachments: submission.attachments,
          status: submission.status,
          marks: submission.marks,
          feedback: submission.feedback,
          submittedAt: submission.submittedAt,
          gradedAt: submission.gradedAt,
        })),
      },
    }
  }

  async gradeSubmission(user: User, submissionId: number, gradeAssignmentDto: GradeAssignmentDto) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ["assignment"],
    })

    if (!submission) {
      throw new NotFoundException("Submission not found")
    }

    if (submission.assignment.schoolId !== user.schoolId) {
      throw new NotFoundException("Submission not found")
    }

    const { marks, feedback } = gradeAssignmentDto

    submission.marks = marks
    submission.feedback = feedback
    submission.status = SubmissionStatus.GRADED
    submission.gradedBy = user.id
    submission.gradedAt = new Date()

    await this.submissionRepository.save(submission)

    return {
      status: 1,
      message: "Assignment graded successfully",
      data: submission,
    }
  }
}
