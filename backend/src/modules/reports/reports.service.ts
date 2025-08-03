import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Between, Repository } from "typeorm"
import { User } from "../../entities/user.entity"
import { StaffAttendance } from "../../entities/staff-attendance.entity"
import { StudentAttendance, StudentAttendanceStatus } from "../../entities/student-attendance.entity"
import { StudentFee } from "../../entities/student-fee.entity"
import { FeePayment } from "../../entities/fee-payment.entity"
import { Salary } from "../../entities/salary.entity"
import { RoleName } from "../../entities/role.entity"

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(StaffAttendance)
    private staffAttendanceRepository: Repository<StaffAttendance>,
    @InjectRepository(StudentAttendance)
    private studentAttendanceRepository: Repository<StudentAttendance>,
    @InjectRepository(StudentFee)
    private studentFeeRepository: Repository<StudentFee>,
    @InjectRepository(FeePayment)
    private feePaymentRepository: Repository<FeePayment>,
    @InjectRepository(Salary)
    private salaryRepository: Repository<Salary>,
  ) {}

  async getDashboardStats(currentUser: User) {
    const schoolFilter = currentUser.role.name === RoleName.ADMIN ? {} : { schoolId: currentUser.schoolId }

    // Get total students
    const totalStudents = await this.userRepository.count({
      where: { ...schoolFilter, role: { name: RoleName.STUDENT } },
      relations: ["role"],
    })

    // Get total staff (Teachers, Staff, Principals)
    const totalStaff = await this.userRepository.count({
      where: {
        ...schoolFilter,
        role: { name: In([RoleName.TEACHER, RoleName.STAFF, RoleName.PRINCIPAL]) },
      },
      relations: ["role"],
    })

    // Calculate attendance rate for current month
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const attendanceSummary = await this.studentAttendanceRepository
      .createQueryBuilder("attendance")
      .select("COUNT(*)", "totalAttendanceRecords")
      .addSelect('SUM(CASE WHEN attendance.status = :presentStatus THEN 1 ELSE 0 END)', "presentRecords")
      .leftJoin("attendance.student", "student")
      .where("attendance.date BETWEEN :start AND :end", { start: startOfMonth, end: endOfMonth })
      .andWhere(currentUser.role.name === RoleName.ADMIN ? "1=1" : "student.schoolId = :schoolId", {
        schoolId: currentUser.schoolId,
      })
      .setParameters({ presentStatus: StudentAttendanceStatus.PRESENT })
      .getRawOne()

    const attendanceRate = Number(attendanceSummary.totalAttendanceRecords) > 0
      ? Math.round((Number(attendanceSummary.presentRecords) / Number(attendanceSummary.totalAttendanceRecords)) * 100)
      : 0

    // Calculate total revenue for current month
    const totalRevenue = await this.feePaymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .leftJoin("payment.student", "student")
      .where("payment.paymentDate BETWEEN :startDate AND :endDate", { startDate: startOfMonth, endDate: endOfMonth })
      .andWhere("payment.status = :status", { status: "SUCCESS" })
      .andWhere(currentUser.role.name === RoleName.ADMIN ? "1=1" : "student.schoolId = :schoolId", {
        schoolId: currentUser.schoolId,
      })
      .getRawOne()

    return {
      totalStudents,
      totalStaff,
      attendanceRate,
      totalRevenue: totalRevenue?.total || 0,
    }
  }

  async getAttendanceSummary(filters: any, currentUser: User) {
    const { startDate, endDate, type } = filters

    if (type === "staff") {
      const queryBuilder = this.staffAttendanceRepository
        .createQueryBuilder("attendance")
        .leftJoin("attendance.staff", "staff")
        .select(["attendance.status", "COUNT(*) as count"])
        .groupBy("attendance.status")

      if (currentUser.role.name !== RoleName.ADMIN) {
        queryBuilder.andWhere("staff.schoolId = :schoolId", { schoolId: currentUser.schoolId })
      }

      if (startDate) {
        queryBuilder.andWhere("attendance.date >= :startDate", { startDate })
      }

      if (endDate) {
        queryBuilder.andWhere("attendance.date <= :endDate", { endDate })
      }

      return queryBuilder.getRawMany()
    } else {
      const queryBuilder = this.studentAttendanceRepository
        .createQueryBuilder("attendance")
        .leftJoin("attendance.student", "student")
        .select(["attendance.status", "COUNT(*) as count"])
        .groupBy("attendance.status")

      if (currentUser.role.name !== RoleName.ADMIN) {
        queryBuilder.andWhere("student.schoolId = :schoolId", { schoolId: currentUser.schoolId })
      }

      if (startDate) {
        queryBuilder.andWhere("attendance.date >= :startDate", { startDate })
      }

      if (endDate) {
        queryBuilder.andWhere("attendance.date <= :endDate", { endDate })
      }

      return queryBuilder.getRawMany()
    }
  }

  async getFinancialSummary(filters: any, currentUser: User) {
    const { month, year } = filters
    const currentDate = new Date()
    const targetMonth = month || currentDate.getMonth() + 1
    const targetYear = year || currentDate.getFullYear()
    const startOfMonth = new Date(targetYear, targetMonth - 1, 1)
    const endOfMonth = new Date(targetYear, targetMonth, 0)

    // Fee collections
    const feeCollections = await this.feePaymentRepository
      .createQueryBuilder("payment")
      .select(["SUM(payment.amount) as totalAmount", "COUNT(*) as totalTransactions", "payment.paymentMethod"])
      .leftJoin("payment.student", "student")
      .where("payment.paymentDate BETWEEN :startDate AND :endDate", { startDate: startOfMonth, endDate: endOfMonth })
      .andWhere("payment.status = :status", { status: "SUCCESS" })
      .andWhere(currentUser.role.name === RoleName.ADMIN ? "1=1" : "student.schoolId = :schoolId", {
        schoolId: currentUser.schoolId,
      })
      .groupBy("payment.paymentMethod")
      .getRawMany()

    // Salary expenses
    const salaryExpenses = await this.salaryRepository
      .createQueryBuilder("salary")
      .select("SUM(salary.netSalary)", "totalSalary")
      .leftJoin("salary.staff", "staff")
      .where("salary.paymentDate BETWEEN :startDate AND :endDate", { startDate: startOfMonth, endDate: endOfMonth })
      .andWhere("salary.status = :status", { status: "PAID" })
      .andWhere(currentUser.role.name === RoleName.ADMIN ? "1=1" : "staff.schoolId = :schoolId", {
        schoolId: currentUser.schoolId,
      })
      .getRawOne()

    return {
      feeCollections,
      salaryExpenses: salaryExpenses?.totalSalary || 0,
      netIncome:
        feeCollections.reduce((sum, item) => sum + Number.parseFloat(item.totalAmount || 0), 0) -
        (salaryExpenses?.totalSalary || 0),
    }
  }

  async getStaffPerformance(filters: any, currentUser: User) {
    const { startDate, endDate } = filters

    const queryBuilder = this.staffAttendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.staff", "staff")
      .leftJoinAndSelect("staff.role", "role")
      .select([
        "staff.id",
        "staff.firstName",
        "staff.lastName",
        "staff.employeeId",
        "role.name",
        'COUNT(CASE WHEN attendance.status = "present" THEN 1 ELSE NULL END) as presentDays',
        'COUNT(CASE WHEN attendance.status = "absent" THEN 1 ELSE NULL END) as absentDays',
        'COUNT(CASE WHEN attendance.status = "late" THEN 1 ELSE NULL END) as lateDays',
        "COUNT(attendance.id) as totalDays",
      ])
      .groupBy("staff.id")

    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("staff.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    if (startDate) {
      queryBuilder.andWhere("attendance.date >= :startDate", { startDate })
    }

    if (endDate) {
      queryBuilder.andWhere("attendance.date <= :endDate", { endDate })
    }

    return queryBuilder.getRawMany()
  }

  async getStudentOverview(filters: any, currentUser: User) {
    const { classId, grade } = filters

    const queryBuilder = this.userRepository
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.role", "role")
      .leftJoinAndSelect("student.class", "class")
      .leftJoinAndSelect("student.school", "school")
      .leftJoin("student.studentAttendances", "attendance")
      .select([
        "student.id",
        "student.firstName",
        "student.lastName",
        "class.name as className",
        "class.grade as classGrade",
        "school.name as schoolName",
        'COUNT(CASE WHEN attendance.status = "present" THEN 1 ELSE NULL END) as presentDays',
        'COUNT(CASE WHEN attendance.status = "absent" THEN 1 ELSE NULL END) as absentDays',
        "COUNT(attendance.id) as totalDays",
      ])
      .where("role.name = :role", { role: RoleName.STUDENT })
      .groupBy("student.id, class.id, school.id")

    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("student.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    if (classId) {
      queryBuilder.andWhere("student.classId = :classId", { classId })
    }

    if (grade) {
      queryBuilder.andWhere("class.grade = :grade", { grade })
    }

    const students = await queryBuilder.getRawMany()

    return students.map((student) => ({
      ...student,
      attendanceRate:
        Number(student.totalDays) > 0
          ? Math.round((Number(student.presentDays) / Number(student.totalDays)) * 100)
          : 0,
    }))
  }
}
