import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { LeaveType } from "../../entities/leave-type.entity"
import { type StaffLeaveApplication, LeaveStatus } from "../../entities/staff-leave-application.entity"
import type { StudentLeaveApplication } from "../../entities/student-leave-application.entity"
import type { User } from "../../entities/user.entity"
import type { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto"
import type { ApproveLeaveDto } from "./dto/approve-leave.dto"

@Injectable()
export class LeavesService {
  constructor(
    private leaveTypeRepository: Repository<LeaveType>,
    private staffLeaveRepository: Repository<StaffLeaveApplication>,
    private studentLeaveRepository: Repository<StudentLeaveApplication>,
    private userRepository: Repository<User>,
  ) {}

  async getLeaveTypes(schoolId: number) {
    const leaveTypes = await this.leaveTypeRepository.find({
      where: { schoolId },
      order: { name: "ASC" },
    })

    return {
      status: 1,
      message: "Leave types retrieved successfully",
      data: leaveTypes,
    }
  }

  async getPendingStaffLeaves(schoolId: number) {
    const pendingLeaves = await this.staffLeaveRepository
      .createQueryBuilder("leave")
      .leftJoinAndSelect("leave.staff", "staff")
      .leftJoinAndSelect("leave.leaveType", "leaveType")
      .where("staff.schoolId = :schoolId", { schoolId })
      .andWhere("leave.status = :status", { status: LeaveStatus.PENDING })
      .orderBy("leave.appliedDate", "DESC")
      .getMany()

    return {
      status: 1,
      message: "Pending staff leaves retrieved successfully",
      data: pendingLeaves.map((leave) => ({
        id: leave.id,
        staffName: leave.staff.fullName,
        department: leave.staff.department,
        leaveType: leave.leaveType.name,
        startDate: leave.startDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
        reason: leave.reason,
        appliedDate: leave.appliedDate,
        medicalCertificate: leave.medicalCertificate,
      })),
    }
  }

  async getPendingStudentLeaves(schoolId: number) {
    const pendingLeaves = await this.studentLeaveRepository
      .createQueryBuilder("leave")
      .leftJoinAndSelect("leave.student", "student")
      .leftJoinAndSelect("leave.leaveType", "leaveType")
      .leftJoinAndSelect("leave.appliedByUser", "appliedBy")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("leave.status = :status", { status: LeaveStatus.PENDING })
      .orderBy("leave.appliedDate", "DESC")
      .getMany()

    return {
      status: 1,
      message: "Pending student leaves retrieved successfully",
      data: pendingLeaves.map((leave) => ({
        id: leave.id,
        studentName: leave.student.fullName,
        leaveType: leave.leaveType.name,
        startDate: leave.startDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
        reason: leave.reason,
        appliedDate: leave.appliedDate,
        appliedBy: leave.appliedByUser.fullName,
      })),
    }
  }

  async applyStaffLeave(user: User, createLeaveApplicationDto: CreateLeaveApplicationDto) {
    const { leaveTypeId, startDate, endDate, reason, medicalCertificate } = createLeaveApplicationDto

    // Validate leave type
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: leaveTypeId, schoolId: user.schoolId },
    })

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

    // Check if medical certificate is required
    if (leaveType.requiresMedicalCertificate && !medicalCertificate) {
      throw new BadRequestException("Medical certificate is required for this leave type")
    }

    const leaveApplication = this.staffLeaveRepository.create({
      staffId: user.id,
      leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      medicalCertificate,
      status: LeaveStatus.PENDING,
    })

    await this.staffLeaveRepository.save(leaveApplication)

    return {
      status: 1,
      message: "Leave application submitted successfully",
      data: leaveApplication,
    }
  }

  async applyStudentLeave(user: User, createLeaveApplicationDto: CreateLeaveApplicationDto) {
    const { studentId, leaveTypeId, startDate, endDate, reason } = createLeaveApplicationDto

    // Validate student belongs to the same school
    const student = await this.userRepository.findOne({
      where: { id: studentId, schoolId: user.schoolId, roleId: 5 },
    })

    if (!student) {
      throw new NotFoundException("Student not found")
    }

    // Validate leave type
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: leaveTypeId, schoolId: user.schoolId },
    })

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
      studentId,
      leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      appliedBy: user.id,
      status: LeaveStatus.PENDING,
    })

    await this.studentLeaveRepository.save(leaveApplication)

    return {
      status: 1,
      message: "Student leave application submitted successfully",
      data: leaveApplication,
    }
  }

  async approveStaffLeave(user: User, leaveId: number, approveLeaveDto: ApproveLeaveDto) {
    const { status, rejectionReason } = approveLeaveDto

    const leaveApplication = await this.staffLeaveRepository.findOne({
      where: { id: leaveId },
      relations: ["staff"],
    })

    if (!leaveApplication) {
      throw new NotFoundException("Leave application not found")
    }

    // Check if the leave belongs to the same school
    if (leaveApplication.staff.schoolId !== user.schoolId) {
      throw new NotFoundException("Leave application not found")
    }

    // Update leave status
    leaveApplication.status = status as LeaveStatus
    leaveApplication.approvedBy = user.id
    leaveApplication.approvedDate = new Date()

    if (status === "rejected" && rejectionReason) {
      leaveApplication.rejectionReason = rejectionReason
    }

    await this.staffLeaveRepository.save(leaveApplication)

    return {
      status: 1,
      message: `Leave application ${status} successfully`,
      data: leaveApplication,
    }
  }

  async approveStudentLeave(user: User, leaveId: number, approveLeaveDto: ApproveLeaveDto) {
    const { status, rejectionReason } = approveLeaveDto

    const leaveApplication = await this.studentLeaveRepository.findOne({
      where: { id: leaveId },
      relations: ["student"],
    })

    if (!leaveApplication) {
      throw new NotFoundException("Leave application not found")
    }

    // Check if the leave belongs to the same school
    if (leaveApplication.student.schoolId !== user.schoolId) {
      throw new NotFoundException("Leave application not found")
    }

    // Update leave status
    leaveApplication.status = status as LeaveStatus
    leaveApplication.approvedBy = user.id
    leaveApplication.approvedDate = new Date()

    if (status === "rejected" && rejectionReason) {
      leaveApplication.rejectionReason = rejectionReason
    }

    await this.studentLeaveRepository.save(leaveApplication)

    return {
      status: 1,
      message: `Student leave application ${status} successfully`,
      data: leaveApplication,
    }
  }

  async getStaffLeaveHistory(schoolId: number, staffId: number) {
    const staff = await this.userRepository.findOne({
      where: { id: staffId, schoolId },
    })

    if (!staff) {
      throw new NotFoundException("Staff member not found")
    }

    const leaveHistory = await this.staffLeaveRepository.find({
      where: { staffId },
      relations: ["leaveType", "approvedByUser"],
      order: { appliedDate: "DESC" },
    })

    return {
      status: 1,
      message: "Staff leave history retrieved successfully",
      data: {
        staff: {
          id: staff.id,
          name: staff.fullName,
          department: staff.department,
        },
        leaves: leaveHistory.map((leave) => ({
          id: leave.id,
          leaveType: leave.leaveType.name,
          startDate: leave.startDate,
          endDate: leave.endDate,
          totalDays: leave.totalDays,
          reason: leave.reason,
          status: leave.status,
          appliedDate: leave.appliedDate,
          approvedBy: leave.approvedByUser?.fullName,
          approvedDate: leave.approvedDate,
          rejectionReason: leave.rejectionReason,
        })),
      },
    }
  }
}
