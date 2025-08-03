import { Injectable, NotFoundException } from "@nestjs/common"
import { type Repository, Between } from "typeorm"
import { type StaffAttendance, AttendanceStatus } from "../../entities/staff-attendance.entity"
import { type StudentAttendance, StudentAttendanceStatus } from "../../entities/student-attendance.entity"
import type { User } from "../../entities/user.entity"
import type { Class } from "../../entities/class.entity"
import type { MarkAttendanceDto } from "./dto/mark-attendance.dto"

@Injectable()
export class AttendanceService {
  private staffAttendanceRepository: Repository<StaffAttendance>
  private studentAttendanceRepository: Repository<StudentAttendance>
  private userRepository: Repository<User>
  private classRepository: Repository<Class>

  constructor(
    staffAttendanceRepository: Repository<StaffAttendance>,
    studentAttendanceRepository: Repository<StudentAttendance>,
    userRepository: Repository<User>,
    classRepository: Repository<Class>,
  ) {
    this.staffAttendanceRepository = staffAttendanceRepository
    this.studentAttendanceRepository = studentAttendanceRepository
    this.userRepository = userRepository
    this.classRepository = classRepository
  }

  async getTodayStaffAttendance(schoolId: number) {
    const today = new Date().toISOString().split("T")[0]

    const attendance = await this.staffAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.staff", "staff")
      .where("staff.schoolId = :schoolId", { schoolId })
      .andWhere("attendance.date = :date", { date: today })
      .getMany()

    const totalStaff = await this.userRepository.count({
      where: { schoolId, roleId: 4, status: "active" }, // Teachers
    })

    const stats = {
      total: totalStaff,
      present: attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length,
      absent: attendance.filter((a) => a.status === AttendanceStatus.ABSENT).length,
      late: attendance.filter((a) => a.status === AttendanceStatus.LATE).length,
    }

    return {
      status: 1,
      message: "Staff attendance retrieved successfully",
      data: {
        attendance: attendance.map((a) => ({
          id: a.id,
          staffId: a.staffId,
          name: a.staff.fullName,
          department: a.staff.department,
          status: a.status,
          checkInTime: a.checkInTime,
          checkOutTime: a.checkOutTime,
          workingHours: a.workingHours,
          notes: a.notes,
        })),
        stats,
      },
    }
  }

  async getTodayStudentAttendance(schoolId: number) {
    const today = new Date().toISOString().split("T")[0]

    const classes = await this.classRepository.find({
      where: { schoolId },
      relations: ["studentAttendance", "studentAttendance.student"],
    })

    const classAttendance = await Promise.all(
      classes.map(async (classEntity) => {
        const totalStudents = await this.userRepository.count({
          where: { roleId: 5, status: "active" }, // Students in this class
        })

        const todayAttendance = await this.studentAttendanceRepository.count({
          where: {
            classId: classEntity.id,
            date: today as any,
            status: StudentAttendanceStatus.PRESENT,
          },
        })

        const absentCount = totalStudents - todayAttendance

        return {
          classId: classEntity.id,
          className: `${classEntity.name} ${classEntity.section || ""}`.trim(),
          totalStudents,
          present: todayAttendance,
          absent: absentCount,
          attendanceRate: totalStudents > 0 ? ((todayAttendance / totalStudents) * 100).toFixed(1) : "0",
        }
      }),
    )

    return {
      status: 1,
      message: "Student attendance retrieved successfully",
      data: classAttendance,
    }
  }

  async getStaffAttendanceStats(schoolId: number, date?: string) {
    const targetDate = date || new Date().toISOString().split("T")[0]

    const attendance = await this.staffAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.staff", "staff")
      .where("staff.schoolId = :schoolId", { schoolId })
      .andWhere("attendance.date = :date", { date: targetDate })
      .getMany()

    const totalStaff = await this.userRepository.count({
      where: { schoolId, roleId: 4, status: "active" },
    })

    const present = attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length
    const absent = totalStaff - present
    const late = attendance.filter((a) => a.status === AttendanceStatus.LATE).length
    const rate = totalStaff > 0 ? ((present / totalStaff) * 100).toFixed(1) : "0"

    return {
      status: 1,
      message: "Staff attendance stats retrieved successfully",
      data: {
        total: totalStaff,
        present,
        absent,
        late,
        rate: Number.parseFloat(rate),
      },
    }
  }

  async getStudentAttendanceStats(schoolId: number, date?: string) {
    const targetDate = date || new Date().toISOString().split("T")[0]

    // Get total students in school
    const totalStudents = await this.userRepository.count({
      where: { schoolId, roleId: 5, status: "active" },
    })

    // Get present students for the date
    const presentCount = await this.studentAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.student", "student")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("attendance.date = :date", { date: targetDate })
      .andWhere("attendance.status = :status", { status: StudentAttendanceStatus.PRESENT })
      .getCount()

    const absent = totalStudents - presentCount
    const rate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : "0"

    return {
      status: 1,
      message: "Student attendance stats retrieved successfully",
      data: {
        total: totalStudents,
        present: presentCount,
        absent,
        rate: Number.parseFloat(rate),
      },
    }
  }

  async markStaffAttendance(user: User, markAttendanceDto: MarkAttendanceDto) {
    const { staffId, date, status, checkInTime, checkOutTime, notes } = markAttendanceDto

    // Check if staff belongs to the same school
    const staff = await this.userRepository.findOne({
      where: { id: staffId, schoolId: user.schoolId },
    })

    if (!staff) {
      throw new NotFoundException("Staff member not found")
    }

    // Check if attendance already exists for this date
    let attendance = await this.staffAttendanceRepository.findOne({
      where: { staffId, date: date as any },
    })

    if (attendance) {
      // Update existing attendance
      attendance.status = status as AttendanceStatus
      attendance.checkInTime = checkInTime
      attendance.checkOutTime = checkOutTime
      attendance.notes = notes
      attendance.markedBy = user.id

      // Calculate working hours if both times are provided
      if (checkInTime && checkOutTime) {
        const checkIn = new Date(`2000-01-01 ${checkInTime}`)
        const checkOut = new Date(`2000-01-01 ${checkOutTime}`)
        const diffMs = checkOut.getTime() - checkIn.getTime()
        attendance.workingHours = diffMs / (1000 * 60 * 60) // Convert to hours
      }
    } else {
      // Create new attendance record
      attendance = this.staffAttendanceRepository.create({
        staffId,
        date: date as any,
        status: status as AttendanceStatus,
        checkInTime,
        checkOutTime,
        notes,
        markedBy: user.id,
      })

      // Calculate working hours
      if (checkInTime && checkOutTime) {
        const checkIn = new Date(`2000-01-01 ${checkInTime}`)
        const checkOut = new Date(`2000-01-01 ${checkOutTime}`)
        const diffMs = checkOut.getTime() - checkIn.getTime()
        attendance.workingHours = diffMs / (1000 * 60 * 60)
      }
    }

    await this.staffAttendanceRepository.save(attendance)

    return {
      status: 1,
      message: "Attendance marked successfully",
      data: attendance,
    }
  }

  async getStaffAttendanceHistory(schoolId: number, staffId: number, month?: number, year?: number) {
    const staff = await this.userRepository.findOne({
      where: { id: staffId, schoolId },
    })

    if (!staff) {
      throw new NotFoundException("Staff member not found")
    }

    const currentDate = new Date()
    const targetMonth = month || currentDate.getMonth() + 1
    const targetYear = year || currentDate.getFullYear()

    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0)

    const attendance = await this.staffAttendanceRepository.find({
      where: {
        staffId,
        date: Between(startDate, endDate),
      },
      order: { date: "ASC" },
    })

    const summary = {
      totalDays: attendance.length,
      present: attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length,
      absent: attendance.filter((a) => a.status === AttendanceStatus.ABSENT).length,
      late: attendance.filter((a) => a.status === AttendanceStatus.LATE).length,
      halfDay: attendance.filter((a) => a.status === AttendanceStatus.HALF_DAY).length,
    }

    return {
      status: 1,
      message: "Staff attendance history retrieved successfully",
      data: {
        staff: {
          id: staff.id,
          name: staff.fullName,
          department: staff.department,
        },
        month: targetMonth,
        year: targetYear,
        attendance,
        summary,
      },
    }
  }
}
