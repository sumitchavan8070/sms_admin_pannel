import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { Assignment, AssignmentStatus } from "@/entities/assignment.entity"
import { AssignmentSubmission, SubmissionStatus } from "@/entities/assignment-submission.entity"
import { Subject } from "@/entities/subject.entity"
import { Class } from "@/entities/class.entity"
import { User } from "@/entities/user.entity"
import { RoleName } from "@/entities/role.entity"
import type { CreateAssignmentDto } from "./dto/create-assignment.dto"
import type { UpdateAssignmentDto } from "./dto/update-assignment.dto"
import type { SubmitAssignmentDto } from "./dto/submit-assignment.dto"
import type { GradeAssignmentDto } from "./dto/grade-assignment.dto"

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentSubmission)
    private assignmentSubmissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto, currentUser: User) {
    const { subjectId, classId, title, description, instructions, dueDate, maxMarks, attachments } = createAssignmentDto

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      currentUser.role.name !== RoleName.TEACHER
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    // Verify subject exists
    const subject = await this.subjectRepository.findOne({ where: { id: subjectId } })
    if (!subject) {
      throw new NotFoundException("Subject not found")
    }

    // Verify class exists
    const classEntity = await this.classRepository.findOne({ where: { id: classId } })
    if (!classEntity) {
      throw new NotFoundException("Class not found")
    }

    // Check if teacher is assigned to this subject (if not admin/principal)
    if (currentUser.role.name === RoleName.TEACHER && subject.teacherId !== currentUser.id) {
      throw new ForbiddenException("You are not assigned to this subject")
    }

    const assignment = this.assignmentRepository.create({
      subjectId,
      classId,
      teacherId: currentUser.id,
      title,
      description,
      instructions,
      dueDate: new Date(dueDate),
      maxMarks,
      attachments,
      status: AssignmentStatus.DRAFT,
    })

    return this.assignmentRepository.save(assignment)
  }

  async findAll(filters: any, currentUser: User) {
    const { classId, subjectId, teacherId, status } = filters

    const queryBuilder = this.assignmentRepository
      .createQueryBuilder("assignment")
      .leftJoinAndSelect("assignment.subject", "subject")
      .leftJoinAndSelect("assignment.class", "class")
      .leftJoinAndSelect("assignment.teacher", "teacher")

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("class.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    // If teacher, only show own assignments
    if (currentUser.role.name === RoleName.TEACHER) {
      queryBuilder.andWhere("assignment.teacherId = :teacherId", { teacherId: currentUser.id })
    }

    // If student, only show assignments for their class
    if (currentUser.role.name === RoleName.STUDENT) {
      queryBuilder.andWhere("assignment.classId = :classId", { classId: currentUser.classId })
      queryBuilder.andWhere("assignment.status = :status", { status: AssignmentStatus.PUBLISHED })
    }

    if (classId) {
      queryBuilder.andWhere("assignment.classId = :classId", { classId })
    }

    if (subjectId) {
      queryBuilder.andWhere("assignment.subjectId = :subjectId", { subjectId })
    }

    if (teacherId) {
      queryBuilder.andWhere("assignment.teacherId = :teacherId", { teacherId })
    }

    if (status) {
      queryBuilder.andWhere("assignment.status = :status", { status })
    }

    return queryBuilder.orderBy("assignment.createdAt", "DESC").getMany()
  }

  async findOne(id: number, currentUser: User) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ["subject", "class", "teacher", "submissions", "submissions.student"],
    })

    if (!assignment) {
      throw new NotFoundException("Assignment not found")
    }

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && assignment.class.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    // Students can only see published assignments for their class
    if (currentUser.role.name === RoleName.STUDENT) {
      if (assignment.status !== AssignmentStatus.PUBLISHED || assignment.classId !== currentUser.classId) {
        throw new ForbiddenException("Assignment not accessible")
      }
    }

    return assignment
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto, currentUser: User) {
    const assignment = await this.findOne(id, currentUser)

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      assignment.teacherId !== currentUser.id
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.assignmentRepository.update(id, updateAssignmentDto)
    return this.findOne(id, currentUser)
  }

  async remove(id: number, currentUser: User) {
    const assignment = await this.findOne(id, currentUser)

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      assignment.teacherId !== currentUser.id
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.assignmentRepository.delete(id)
    return { message: "Assignment deleted successfully" }
  }

  async submitAssignment(id: number, submitAssignmentDto: SubmitAssignmentDto, currentUser: User) {
    const { content, attachments } = submitAssignmentDto

    // Check if user is a student
    if (currentUser.role.name !== RoleName.STUDENT) {
      throw new ForbiddenException("Only students can submit assignments")
    }

    const assignment = await this.findOne(id, currentUser)

    // Check if assignment is published and not closed
    if (assignment.status !== AssignmentStatus.PUBLISHED) {
      throw new BadRequestException("Assignment is not available for submission")
    }

    // Check if due date has passed
    if (new Date() > assignment.dueDate) {
      throw new BadRequestException("Assignment submission deadline has passed")
    }

    // Check if student has already submitted
    const existingSubmission = await this.assignmentSubmissionRepository.findOne({
      where: { assignmentId: id, studentId: currentUser.id },
    })

    if (existingSubmission) {
      // Update existing submission
      await this.assignmentSubmissionRepository.update(existingSubmission.id, {
        content,
        attachments,
        submittedAt: new Date(),
        status: SubmissionStatus.SUBMITTED,
      })
      return this.assignmentSubmissionRepository.findOne({ where: { id: existingSubmission.id } })
    } else {
      // Create new submission
      const submission = this.assignmentSubmissionRepository.create({
        assignmentId: id,
        studentId: currentUser.id,
        content,
        attachments,
        submittedAt: new Date(),
        status: SubmissionStatus.SUBMITTED,
      })
      return this.assignmentSubmissionRepository.save(submission)
    }
  }

  async gradeSubmission(submissionId: number, gradeAssignmentDto: GradeAssignmentDto, currentUser: User) {
    const { marks, feedback } = gradeAssignmentDto

    const submission = await this.assignmentSubmissionRepository.findOne({
      where: { id: submissionId },
      relations: ["assignment", "assignment.class", "student"],
    })

    if (!submission) {
      throw new NotFoundException("Submission not found")
    }

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      submission.assignment.teacherId !== currentUser.id
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    // Validate marks
    if (marks > submission.assignment.maxMarks) {
      throw new BadRequestException(`Marks cannot exceed maximum marks (${submission.assignment.maxMarks})`)
    }

    await this.assignmentSubmissionRepository.update(submissionId, {
      marks,
      feedback,
      status: SubmissionStatus.GRADED,
      gradedAt: new Date(),
      gradedById: currentUser.id,
    })

    return this.assignmentSubmissionRepository.findOne({
      where: { id: submissionId },
      relations: ["assignment", "student", "gradedBy"],
    })
  }

  async getSubmissions(id: number, currentUser: User) {
    const assignment = await this.findOne(id, currentUser)

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      assignment.teacherId !== currentUser.id
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return this.assignmentSubmissionRepository.find({
      where: { assignmentId: id },
      relations: ["student", "gradedBy"],
      order: { submittedAt: "DESC" },
    })
  }
  

  async getMySubmissions(currentUser: User) {
    // Check if user is a student
    if (currentUser.role.name !== RoleName.STUDENT) {
      throw new ForbiddenException("Only students can view their submissions")
    }

    return this.assignmentSubmissionRepository.find({
      where: { studentId: currentUser.id },
      relations: ["assignment", "assignment.subject", "assignment.teacher", "gradedBy"],
      order: { submittedAt: "DESC" },
    })
  }
}
