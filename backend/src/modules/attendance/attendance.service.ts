import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm" // <-- Added this import
import type { Repository } from "typeorm"
import { StaffAttendance, AttendanceStatus } from "@/entities/staff-attendance.entity" // Removed 'type'
import { StudentAttendance, StudentAttendanceStatus } from "@/entities/student-attendance.entity" // Removed 'type'
import { User } from "@/entities/user.entity" // Removed 'type'
import { Subject } from "@/entities/subject.entity" // Removed 'type'
import { RoleName } from "@/entities/role.entity"
import type { MarkAttendanceDto } from "./dto/mark-attendance.dto"

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(StaffAttendance)
    private readonly staffAttendanceRepository: Repository<StaffAttendance>,
    @InjectRepository(StudentAttendance)
    private readonly studentAttendanceRepository: Repository<StudentAttendance>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async markStaffAttendance(markAttendanceDto: MarkAttendanceDto, currentUser: User) {
    const { userId, date, status, checkInTime, checkOutTime, remarks } = markAttendanceDto

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions")
    }

    // Verify staff exists
    const staff = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["role", "school"],
    })

    if (!staff) {
      throw new NotFoundException("Staff not found")
    }

    // Check if attendance already exists for this date
    const existingAttendance = await this.staffAttendanceRepository.findOne({
      where: { staffId: userId, date: new Date(date) },
    })

    if (existingAttendance) {
      // Update existing attendance
      await this.staffAttendanceRepository.update(existingAttendance.id, {
        status: status as AttendanceStatus,
        checkInTime,
        checkOutTime,
        remarks,
      })
      return this.staffAttendanceRepository.findOne({ where: { id: existingAttendance.id } })
    } else {
      // Create new attendance record
      const attendance = this.staffAttendanceRepository.create({
        staffId: userId,
        date: new Date(date),
        status: status as AttendanceStatus,
        checkInTime,
        checkOutTime,
        remarks,
      })
      return this.staffAttendanceRepository.save(attendance)
    }
  }

  async markStudentAttendance(markAttendanceDto: MarkAttendanceDto, currentUser: User) {
    const { userId, date, status, subjectId, remarks } = markAttendanceDto

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      currentUser.role.name !== RoleName.TEACHER
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    // Verify student exists
    const student = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["role", "school", "class"],
    })

    if (!student) {
      throw new NotFoundException("Student not found")
    }

    // Verify subject if provided
    let subject = null
    if (subjectId) {
      subject = await this.subjectRepository.findOne({ where: { id: subjectId } })
      if (!subject) {
        throw new NotFoundException("Subject not found")
      }
    }

    // Check if attendance already exists for this date and subject
    const whereCondition: any = { studentId: userId, date: new Date(date) }
    if (subjectId) {
      whereCondition.subjectId = subjectId
    }

    const existingAttendance = await this.studentAttendanceRepository.findOne({
      where: whereCondition,
    })

    if (existingAttendance) {
      // Update existing attendance
      await this.studentAttendanceRepository.update(existingAttendance.id, {
        status: status as StudentAttendanceStatus,
        remarks,
        markedById: currentUser.id,
      })
      return this.studentAttendanceRepository.findOne({ where: { id: existingAttendance.id } })
    } else {
      // Create new attendance record
      const attendance = this.studentAttendanceRepository.create({
        studentId: userId,
        date: new Date(date),
        status: status as StudentAttendanceStatus,
        subjectId,
        remarks,
        markedById: currentUser.id,
      })
      return this.studentAttendanceRepository.save(attendance)
    }
  }

async getStaffAttendance(filters: any, currentUser: User) {
  try {
    const { date, staffId } = filters;

    const queryBuilder = this.staffAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.staff", "staff")
      .leftJoinAndSelect("staff.school", "school");

    // if (currentUser.role.name !== RoleName.ADMIN) {
    //   queryBuilder.andWhere("staff.schoolId = :schoolId", {
    //     schoolId: currentUser.schoolId,
    //   });
    // }

    if (date) { 
      const inputDate = new Date(date);
      const month = inputDate.getMonth() + 1;
      const year = inputDate.getFullYear();

      queryBuilder
        .andWhere("MONTH(attendance.date) = :month", { month })
        .andWhere("YEAR(attendance.date) = :year", { year });
    }

    if (staffId) {
      queryBuilder.andWhere("attendance.staffId = :staffId", { staffId });
    }

    const result = await queryBuilder.getMany();

    return {
      status:1, 
      result
    }
  } catch (error) {
    console.error("🔥 Error in getStaffAttendance:", error);
    throw new Error("Failed to fetch staff attendance");
  }
}



  async getStudentAttendance(filters: any, currentUser: User) {
    const { date, studentId, classId } = filters

    const queryBuilder = this.studentAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.student", "student")
      .leftJoinAndSelect("student.school", "school")
      .leftJoinAndSelect("student.class", "class")
      .leftJoinAndSelect("attendance.subject", "subject")
      .leftJoinAndSelect("attendance.markedBy", "markedBy")

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("student.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    if (date) {
      queryBuilder.andWhere("attendance.date = :date", { date })
    }

    if (studentId) {
      queryBuilder.andWhere("attendance.studentId = :studentId", { studentId })
    }

    if (classId) {
      queryBuilder.andWhere("student.classId = :classId", { classId })
    }

    return queryBuilder.getMany()
  }

  async getStaffAttendanceById(id: number, currentUser: User) {
    const attendance = await this.staffAttendanceRepository.findOne({
      where: { id },
      relations: ["staff", "staff.school"],
    })

    if (!attendance) {
      throw new NotFoundException("Attendance record not found")
    }

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && attendance.staff.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return attendance
  }

  async getStudentAttendanceById(id: number, currentUser: User) {
    const attendance = await this.studentAttendanceRepository.findOne({
      where: { id },
      relations: ["student", "student.school", "student.class", "subject", "markedBy"],
    })

    if (!attendance) {
      throw new NotFoundException("Attendance record not found")
    }

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && attendance.student.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return attendance
  }
}
