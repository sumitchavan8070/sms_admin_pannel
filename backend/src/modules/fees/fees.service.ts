import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { StudentFee, FeeStatus } from "@/entities/student-fee.entity"
import { FeePayment, PaymentStatus } from "@/entities/fee-payment.entity"
import { FeeCategory } from "@/entities/fee-category.entity"
import { User } from "@/entities/user.entity"
import { RoleName } from "@/entities/role.entity"
import type { CreateFeePaymentDto } from "./dto/create-fee-payment.dto"

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(StudentFee)
    private studentFeeRepository: Repository<StudentFee>,
    @InjectRepository(FeePayment)
    private feePaymentRepository: Repository<FeePayment>,
    @InjectRepository(FeeCategory)
    private feeCategoryRepository: Repository<FeeCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPayment(createFeePaymentDto: CreateFeePaymentDto, currentUser: User) {
    const { studentFeeId, amount, paymentMethod, transactionId, remarks } = createFeePaymentDto

    // Verify student fee exists
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id: studentFeeId },
      relations: ["student", "feeCategory"],
    })

    if (!studentFee) {
      throw new NotFoundException("Student fee not found")
    }

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      currentUser.role.name !== RoleName.PRINCIPAL &&
      studentFee.student.schoolId !== currentUser.schoolId
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    // Generate receipt number
    const receiptNumber = await this.generateReceiptNumber()

    // Create payment record
    const payment = this.feePaymentRepository.create({
      studentId: studentFee.studentId,
      studentFeeId,
      amount,
      paymentMethod,
      status: PaymentStatus.SUCCESS,
      transactionId,
      receiptNumber,
      remarks,
      paymentDate: new Date(),
      collectedById: currentUser.id,
    })

    const savedPayment = await this.feePaymentRepository.save(payment)

    // Update student fee
    const newPaidAmount = studentFee.paidAmount + amount
    const newRemainingAmount = studentFee.amount - newPaidAmount
    const newStatus =
      newRemainingAmount <= 0 ? FeeStatus.PAID : newPaidAmount > 0 ? FeeStatus.PARTIAL : FeeStatus.PENDING

    await this.studentFeeRepository.update(studentFeeId, {
      paidAmount: newPaidAmount,
      remainingAmount: newRemainingAmount,
      status: newStatus,
    })

    return savedPayment
  }

  async getStudentFees(studentId: number, currentUser: User) {
    // Verify student exists
    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ["role", "school"],
    })

    if (!student) {
      throw new NotFoundException("Student not found")
    }

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      student.schoolId !== currentUser.schoolId &&
      currentUser.id !== studentId
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return this.studentFeeRepository.find({
      where: { studentId },
      relations: ["feeCategory"],
      order: { createdAt: "DESC" },
    })
  }

  async getPayments(filters: any, currentUser: User) {
    const { studentId, status, startDate, endDate } = filters

    const queryBuilder = this.feePaymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.student", "student")
      .leftJoinAndSelect("payment.studentFee", "studentFee")
      .leftJoinAndSelect("studentFee.feeCategory", "feeCategory")
      .leftJoinAndSelect("payment.collectedBy", "collectedBy")

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("student.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    // If student, only show own payments
    if (currentUser.role.name === RoleName.STUDENT) {
      queryBuilder.andWhere("payment.studentId = :studentId", { studentId: currentUser.id })
    }

    if (studentId) {
      queryBuilder.andWhere("payment.studentId = :studentId", { studentId })
    }

    if (status) {
      queryBuilder.andWhere("payment.status = :status", { status })
    }

    if (startDate) {
      queryBuilder.andWhere("payment.paymentDate >= :startDate", { startDate })
    }

    if (endDate) {
      queryBuilder.andWhere("payment.paymentDate <= :endDate", { endDate })
    }

    return queryBuilder.orderBy("payment.createdAt", "DESC").getMany()
  }

  async getFeeCategories(currentUser: User) {
    const whereCondition =
      currentUser.role.name === RoleName.ADMIN ? { isActive: true } : { schoolId: currentUser.schoolId, isActive: true }

    return this.feeCategoryRepository.find({ where: whereCondition })
  }

  async getOutstandingFees(currentUser: User) {
    const queryBuilder = this.studentFeeRepository
      .createQueryBuilder("fee")
      .leftJoinAndSelect("fee.student", "student")
      .leftJoinAndSelect("fee.feeCategory", "feeCategory")
      .where("fee.status IN (:...statuses)", { statuses: [FeeStatus.PENDING, FeeStatus.PARTIAL, FeeStatus.OVERDUE] })

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("student.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    // If student, only show own fees
    if (currentUser.role.name === RoleName.STUDENT) {
      queryBuilder.andWhere("fee.studentId = :studentId", { studentId: currentUser.id })
    }

    return queryBuilder.orderBy("fee.dueDate", "ASC").getMany()
  }

  private async generateReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.feePaymentRepository.count()
    return `RCP${year}${(count + 1).toString().padStart(6, "0")}`
  }
}
