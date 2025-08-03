import { Injectable } from "@nestjs/common"
import { type Repository, Between } from "typeorm"
import type { User } from "../../entities/user.entity"
import { type StaffAttendance, AttendanceStatus } from "../../entities/staff-attendance.entity"
import { type StudentAttendance, StudentAttendanceStatus } from "../../entities/student-attendance.entity"
import { type StudentFee, FeeStatus } from "../../entities/student-fee.entity"
import type { FeePayment } from "../../entities/fee-payment.entity"
import { type StaffLeaveApplication, LeaveStatus } from "../../entities/staff-leave-application.entity"
import type { Salary } from "../../entities/salary.entity"

@Injectable()
export class ReportsService {
  constructor(
    private userRepository: Repository<User>,
    private staffAttendanceRepository: Repository<StaffAttendance>,
    private studentAttendanceRepository: Repository<StudentAttendance>,
    private studentFeeRepository: Repository<StudentFee>,
    private feePaymentRepository: Repository<FeePayment>,
    private staffLeaveRepository: Repository<StaffLeaveApplication>,
    private salaryRepository: Repository<Salary>,
  ) {}

  async getDashboardStats(schoolId: number) {
    // Get user counts by role
    const totalStaff = await this.userRepository.count({
      where: { schoolId, roleId: 4, status: "active" }, // Teachers
    })

    const totalStudents = await this.userRepository.count({
      where: { schoolId, roleId: 5, status: "active" }, // Students
    })

    const totalPrincipals = await this.userRepository.count({
      where: { schoolId, roleId: 1, status: "active" }, // Principals
    })

    const totalAdmins = await this.userRepository.count({
      where: { schoolId, roleId: 2, status: "active" }, // IT Admins
    })

    // Get today's attendance
    const today = new Date().toISOString().split("T")[0]

    const staffPresentToday = await this.staffAttendanceRepository.count({
      where: {
        date: today as any,
        status: AttendanceStatus.PRESENT,
      },
    })

    const studentsPresentToday = await this.studentAttendanceRepository.count({
      where: {
        date: today as any,
        status: StudentAttendanceStatus.PRESENT,
      },
    })

    // Get pending leaves
    const pendingLeaves = await this.staffLeaveRepository.count({
      where: { status: LeaveStatus.PENDING },
    })

    // Get fee collection this month
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const monthlyCollection = await this.feePaymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.studentFee", "fee")
      .leftJoinAndSelect("fee.student", "student")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("payment.paymentDate BETWEEN :start AND :end", {
        start: startOfMonth,
        end: endOfMonth,
      })
      .getMany()

    const totalMonthlyCollection = monthlyCollection.reduce((sum, payment) => sum + Number(payment.amount), 0)

    // Get pending fees
    const pendingFees = await this.studentFeeRepository
      .createQueryBuilder("fee")
      .leftJoinAndSelect("fee.student", "student")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("fee.status IN (:...statuses)", { statuses: [FeeStatus.PENDING, FeeStatus.PARTIAL, FeeStatus.OVERDUE] })
      .getMany()

    const totalPendingAmount = pendingFees.reduce((sum, fee) => sum + (Number(fee.amount) - Number(fee.paidAmount)), 0)

    return {
      status: 1,
      message: "Dashboard stats retrieved successfully",
      data: {
        users: {
          totalStaff,
          totalStudents,
          totalPrincipals,
          totalAdmins,
          totalUsers: totalStaff + totalStudents + totalPrincipals + totalAdmins,
        },
        attendance: {
          staffPresentToday,
          studentsPresentToday,
          staffAttendanceRate: totalStaff > 0 ? ((staffPresentToday / totalStaff) * 100).toFixed(1) : "0",
          studentAttendanceRate: totalStudents > 0 ? ((studentsPresentToday / totalStudents) * 100).toFixed(1) : "0",
        },
        leaves: {
          pendingLeaves,
        },
        finances: {
          monthlyCollection: totalMonthlyCollection,
          pendingFees: pendingFees.length,
          pendingAmount: totalPendingAmount,
        },
      },
    }
  }

  async getAttendanceSummary(schoolId: number, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const end = endDate ? new Date(endDate) : new Date()

    // Staff attendance summary
    const staffAttendance = await this.staffAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.staff", "staff")
      .where("staff.schoolId = :schoolId", { schoolId })
      .andWhere("attendance.date BETWEEN :start AND :end", { start, end })
      .getMany()

    const staffSummary = staffAttendance.reduce(
      (acc, record) => {
        acc.total++
        if (record.status === AttendanceStatus.PRESENT) acc.present++
        else if (record.status === AttendanceStatus.ABSENT) acc.absent++
        else if (record.status === AttendanceStatus.LATE) acc.late++
        else if (record.status === AttendanceStatus.HALF_DAY) acc.halfDay++
        return acc
      },
      { total: 0, present: 0, absent: 0, late: 0, halfDay: 0 },
    )

    // Student attendance summary
    const studentAttendance = await this.studentAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.student", "student")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("attendance.date BETWEEN :start AND :end", { start, end })
      .getMany()

    const studentSummary = studentAttendance.reduce(
      (acc, record) => {
        acc.total++
        if (record.status === StudentAttendanceStatus.PRESENT) acc.present++
        else if (record.status === StudentAttendanceStatus.ABSENT) acc.absent++
        else if (record.status === StudentAttendanceStatus.LATE) acc.late++
        else if (record.status === StudentAttendanceStatus.EXCUSED) acc.excused++
        return acc
      },
      { total: 0, present: 0, absent: 0, late: 0, excused: 0 },
    )

    return {
      status: 1,
      message: "Attendance summary retrieved successfully",
      data: {
        period: { startDate: start, endDate: end },
        staff: {
          ...staffSummary,
          attendanceRate: staffSummary.total > 0 ? ((staffSummary.present / staffSummary.total) * 100).toFixed(1) : "0",
        },
        students: {
          ...studentSummary,
          attendanceRate:
            studentSummary.total > 0 ? ((studentSummary.present / studentSummary.total) * 100).toFixed(1) : "0",
        },
      },
    }
  }

  async getFinancialSummary(schoolId: number, month?: number, year?: number) {
    const currentDate = new Date()
    const targetMonth = month || currentDate.getMonth() + 1
    const targetYear = year || currentDate.getFullYear()

    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0)

    // Fee collections
    const payments = await this.feePaymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.studentFee", "fee")
      .leftJoinAndSelect("fee.student", "student")
      .leftJoinAndSelect("fee.feeCategory", "category")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("payment.paymentDate BETWEEN :start AND :end", { start: startDate, end: endDate })
      .getMany()

    const totalCollection = payments.reduce((sum, payment) => sum + Number(payment.amount), 0)

    // Category-wise collection
    const categoryWise = payments.reduce(
      (acc, payment) => {
        const categoryName = payment.studentFee.feeCategory.name
        if (!acc[categoryName]) {
          acc[categoryName] = 0
        }
        acc[categoryName] += Number(payment.amount)
        return acc
      },
      {} as Record<string, number>,
    )

    // Salary expenses
    const salaries = await this.salaryRepository
      .createQueryBuilder("salary")
      .leftJoinAndSelect("salary.staff", "staff")
      .where("staff.schoolId = :schoolId", { schoolId })
      .andWhere("salary.month = :month", { month: targetMonth })
      .andWhere("salary.year = :year", { year: targetYear })
      .getMany()

    const totalSalaryExpense = salaries.reduce((sum, salary) => sum + Number(salary.netSalary), 0)

    // Pending fees
    const pendingFees = await this.studentFeeRepository
      .createQueryBuilder("fee")
      .leftJoinAndSelect("fee.student", "student")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("fee.status IN (:...statuses)", { statuses: [FeeStatus.PENDING, FeeStatus.PARTIAL, FeeStatus.OVERDUE] })
      .getMany()

    const totalPending = pendingFees.reduce((sum, fee) => sum + (Number(fee.amount) - Number(fee.paidAmount)), 0)

    return {
      status: 1,
      message: "Financial summary retrieved successfully",
      data: {
        period: { month: targetMonth, year: targetYear },
        income: {
          totalCollection,
          categoryWise,
          transactionCount: payments.length,
        },
        expenses: {
          totalSalaryExpense,
          salaryCount: salaries.length,
        },
        pending: {
          totalPending,
          feeCount: pendingFees.length,
        },
        netIncome: totalCollection - totalSalaryExpense,
      },
    }
  }

  async getStaffPerformance(schoolId: number, month?: number, year?: number) {
    const currentDate = new Date()
    const targetMonth = month || currentDate.getMonth() + 1
    const targetYear = year || currentDate.getFullYear()

    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0)

    // Get all staff members
    const staff = await this.userRepository.find({
      where: { schoolId, roleId: 4, status: "active" }, // Teachers
      select: ["id", "firstName", "lastName", "department", "designation"],
    })

    // Get attendance data for each staff member
    const staffPerformance = await Promise.all(
      staff.map(async (member) => {
        const attendance = await this.staffAttendanceRepository.find({
          where: {
            staffId: member.id,
            date: Between(startDate, endDate),
          },
        })

        const totalDays = attendance.length
        const presentDays = attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length
        const lateDays = attendance.filter((a) => a.status === AttendanceStatus.LATE).length
        const absentDays = attendance.filter((a) => a.status === AttendanceStatus.ABSENT).length

        const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "0"

        // Get leave applications
        const leaves = await this.staffLeaveRepository.count({
          where: {
            staffId: member.id,
            startDate: Between(startDate, endDate),
          },
        })

        return {
          id: member.id,
          name: member.firstName + " " + member.lastName,
          department: member.department,
          designation: member.designation,
          attendance: {
            totalDays,
            presentDays,
            lateDays,
            absentDays,
            attendanceRate: Number.parseFloat(attendanceRate),
          },
          leaves,
        }
      }),
    )

    return {
      status: 1,
      message: "Staff performance retrieved successfully",
      data: {
        period: { month: targetMonth, year: targetYear },
        staff: staffPerformance,
        summary: {
          totalStaff: staff.length,
          averageAttendance: (
            staffPerformance.reduce((sum, s) => sum + s.attendance.attendanceRate, 0) / staff.length
          ).toFixed(1),
        },
      },
    }
  }

  async getStudentsOverview(schoolId: number) {
    // Get total students
    const totalStudents = await this.userRepository.count({
      where: { schoolId, roleId: 5, status: "active" },
    })

    // Get students by class (this would need class enrollment data)
    // For now, we'll provide a basic overview

    // Get fee status overview
    const feeOverview = await this.studentFeeRepository
      .createQueryBuilder("fee")
      .leftJoinAndSelect("fee.student", "student")
      .where("student.schoolId = :schoolId", { schoolId })
      .getMany()

    const feeStatusSummary = feeOverview.reduce(
      (acc, fee) => {
        acc[fee.status]++
        return acc
      },
      { pending: 0, partial: 0, paid: 0, overdue: 0 },
    )

    // Get today's attendance
    const today = new Date().toISOString().split("T")[0]
    const todayAttendance = await this.studentAttendanceRepository.count({
      where: {
        date: today as any,
        status: StudentAttendanceStatus.PRESENT,
      },
    })

    const attendanceRate = totalStudents > 0 ? ((todayAttendance / totalStudents) * 100).toFixed(1) : "0"

    return {
      status: 1,
      message: "Students overview retrieved successfully",
      data: {
        total: totalStudents,
        attendance: {
          presentToday: todayAttendance,
          absentToday: totalStudents - todayAttendance,
          attendanceRate: Number.parseFloat(attendanceRate),
        },
        fees: feeStatusSummary,
      },
    }
  }
}
