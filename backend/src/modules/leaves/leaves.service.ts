import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { StaffLeaveApplication, LeaveStatus } from "@/entities/staff-leave-application.entity"
import { StudentLeaveApplication } from "@/entities/student-leave-application.entity"
import { LeaveType } from "@/entities/leave-type.entity"
import { User } from "@/entities/user.entity"
import { RoleName } from "@/entities/role.entity"
import type { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto"
import type { ApproveLeaveDto } from "./dto/approve-leave.dto"

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(StaffLeaveApplication)
    private staffLeaveRepository: Repository<StaffLeaveApplication>,
    @InjectRepository(StudentLeaveApplication)
    private studentLeaveRepository: Repository<StudentLeaveApplication>,
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async applyStaffLeave(createLeaveApplicationDto: CreateLeaveApplicationDto, currentUser: User) {
    const { leaveTypeId, startDate, endDate, reason } = createLeaveApplicationDto

    // Verify leave type exists
    const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leaveTypeId } })
    if (!leaveType) {
      throw new NotFoundException("Leave type not found")
    }

    // Calculate total days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    if (totalDays <= 0) {
      throw new BadRequestException("End date must be after start date")
    }

    if (leaveType.maxDays > 0 && totalDays > leaveType.maxDays) {
      throw new BadRequestException(`Maximum ${leaveType.maxDays} days allowed for this leave type`)
    }

    const leaveApplication = this.staffLeaveRepository.create({
      staffId: currentUser.id,
      leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      appliedDate: new Date(),
      status: LeaveStatus.PENDING,
    })

    return this.staffLeaveRepository.save(leaveApplication)
  }

  async applyStudentLeave(createLeaveApplicationDto: CreateLeaveApplicationDto, currentUser: User) {
    const { leaveTypeId, startDate, endDate, reason } = createLeaveApplicationDto

    // Verify leave type exists
    const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leaveTypeId } })
    if (!leaveType) {
      throw new NotFoundException("Leave type not found")
    }

    // Calculate total days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    if (totalDays <= 0) {
      throw new BadRequestException("End date must be after start date")
    }

    const leaveApplication = this.studentLeaveRepository.create({
      studentId: currentUser.id,
      leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      appliedDate: new Date(),
      status: LeaveStatus.PENDING,
    })

    return this.studentLeaveRepository.save(leaveApplication)
  }

  async getStaffLeaves(filters: any, currentUser: User) {
    const { status, staffId } = filters

    const queryBuilder = this.staffLeaveRepository
      .createQueryBuilder("leave")
      .leftJoinAndSelect("leave.staff", "staff")
      .leftJoinAndSelect("leave.leaveType", "leaveType")
      .leftJoinAndSelect("leave.approvedBy", "approvedBy")

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("staff.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    // If not admin/principal, only show own leaves
    if (currentUser.role.name === RoleName.TEACHER || currentUser.role.name === RoleName.STAFF) {
      queryBuilder.andWhere("leave.staffId = :staffId", { staffId: currentUser.id })
    }

    if (status) {
      queryBuilder.andWhere("leave.status = :status", { status })
    }

    if (staffId) {
      queryBuilder.andWhere("leave.staffId = :staffId", { staffId })
    }

    return queryBuilder.orderBy("leave.createdAt", "DESC").getMany()
  }

  async getStudentLeaves(filters: any, currentUser: User) {
    const { status, studentId } = filters

    const queryBuilder = this.studentLeaveRepository
      .createQueryBuilder("leave")
      .leftJoinAndSelect("leave.student", "student")
      .leftJoinAndSelect("leave.leaveType", "leaveType")
      .leftJoinAndSelect("leave.approvedBy", "approvedBy")

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("student.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    // If student, only show own leaves
    if (currentUser.role.name === RoleName.STUDENT) {
      queryBuilder.andWhere("leave.studentId = :studentId", { studentId: currentUser.id })
    }

    if (status) {
      queryBuilder.andWhere("leave.status = :status", { status })
    }

    if (studentId) {
      queryBuilder.andWhere("leave.studentId = :studentId", { studentId })
    }

    return queryBuilder.orderBy("leave.createdAt", "DESC").getMany()
  }

  async approveStaffLeave(id: number, approveLeaveDto: ApproveLeaveDto, currentUser: User) {
    const { status, remarks } = approveLeaveDto

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions to approve leaves")
    }

    const leaveApplication = await this.staffLeaveRepository.findOne({
      where: { id },
      relations: ["staff"],
    })

    if (!leaveApplication) {
      throw new NotFoundException("Leave application not found")
    }

    // Check school permissions
    if (currentUser.role.name !== RoleName.ADMIN && leaveApplication.staff.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.staffLeaveRepository.update(id, {
      status: status as LeaveStatus,
      approverRemarks: remarks,
      approvedById: currentUser.id,
      approvedDate: new Date(),
    })

    return this.staffLeaveRepository.findOne({
      where: { id },
      relations: ["staff", "leaveType", "approvedBy"],
    })
  }

  async approveStudentLeave(id: number, approveLeaveDto: ApproveLeaveDto, currentUser: User) {
    const { status, remarks } = approveLeaveDto

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      currentUser.role.name !== RoleName.TEACHER
    ) {
      throw new ForbiddenException("Insufficient permissions to approve leaves")
    }

    const leaveApplication = await this.studentLeaveRepository.findOne({
      where: { id },
      relations: ["student"],
    })

    if (!leaveApplication) {
      throw new NotFoundException("Leave application not found")
    }

    // Check school permissions
    if (currentUser.role.name !== RoleName.ADMIN && leaveApplication.student.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.studentLeaveRepository.update(id, {
      status: status as LeaveStatus,
      approverRemarks: remarks,
      approvedById: currentUser.id,
      approvedDate: new Date(),
    })

    return this.studentLeaveRepository.findOne({
      where: { id },
      relations: ["student", "leaveType", "approvedBy"],
    })
  }

  async getLeaveTypes() {
    return this.leaveTypeRepository.find({ where: { isActive: true } })
  }
}
