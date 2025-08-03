import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { FeeCategory } from "../../entities/fee-category.entity"
import { type StudentFee, FeeStatus } from "../../entities/student-fee.entity"
import type { FeePayment, PaymentMethod } from "../../entities/fee-payment.entity"
import type { User } from "../../entities/user.entity"
import type { CreateFeePaymentDto } from "./dto/create-fee-payment.dto"

@Injectable()
export class FeesService {
  constructor(
    private feeCategoryRepository: Repository<FeeCategory>,
    private studentFeeRepository: Repository<StudentFee>,
    private feePaymentRepository: Repository<FeePayment>,
    private userRepository: Repository<User>,
  ) {}

  async getFeeCategories(schoolId: number) {
    const categories = await this.feeCategoryRepository.find({
      where: { schoolId },
      order: { name: "ASC" },
    })

    return {
      status: 1,
      message: "Fee categories retrieved successfully",
      data: categories,
    }
  }

  async getStudentFees(schoolId: number, studentId: number) {
    // Verify student belongs to the school
    const student = await this.userRepository.findOne({
      where: { id: studentId, schoolId, roleId: 5 },
    })

    if (!student) {
      throw new NotFoundException("Student not found")
    }

    const fees = await this.studentFeeRepository.find({
      where: { studentId },
      relations: ["feeCategory", "payments"],
      order: { dueDate: "ASC" },
    })

    const totalAmount = fees.reduce((sum, fee) => sum + Number(fee.amount), 0)
    const totalPaid = fees.reduce((sum, fee) => sum + Number(fee.paidAmount), 0)
    const totalPending = totalAmount - totalPaid

    return {
      status: 1,
      message: "Student fees retrieved successfully",
      data: {
        student: {
          id: student.id,
          name: student.fullName,
          studentId: student.studentId,
        },
        summary: {
          totalAmount,
          totalPaid,
          totalPending,
        },
        fees: fees.map((fee) => ({
          id: fee.id,
          category: fee.feeCategory.name,
          amount: fee.amount,
          paidAmount: fee.paidAmount,
          pendingAmount: Number(fee.amount) - Number(fee.paidAmount),
          dueDate: fee.dueDate,
          status: fee.status,
          lateFee: fee.lateFee,
          discount: fee.discount,
          payments: fee.payments.map((payment) => ({
            id: payment.id,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            paymentDate: payment.paymentDate,
            transactionId: payment.transactionId,
            receiptNumber: payment.receiptNumber,
          })),
        })),
      },
    }
  }

  async getPendingFees(schoolId: number) {
    const pendingFees = await this.studentFeeRepository
      .createQueryBuilder("fee")
      .leftJoinAndSelect("fee.student", "student")
      .leftJoinAndSelect("fee.feeCategory", "category")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("fee.status IN (:...statuses)", { statuses: [FeeStatus.PENDING, FeeStatus.PARTIAL, FeeStatus.OVERDUE] })
      .orderBy("fee.dueDate", "ASC")
      .getMany()

    const summary = {
      totalPending: pendingFees.reduce((sum, fee) => sum + (Number(fee.amount) - Number(fee.paidAmount)), 0),
      overdueCount: pendingFees.filter((fee) => fee.status === FeeStatus.OVERDUE).length,
      partialCount: pendingFees.filter((fee) => fee.status === FeeStatus.PARTIAL).length,
    }

    return {
      status: 1,
      message: "Pending fees retrieved successfully",
      data: {
        summary,
        fees: pendingFees.map((fee) => ({
          id: fee.id,
          studentName: fee.student.fullName,
          studentId: fee.student.studentId,
          category: fee.feeCategory.name,
          amount: fee.amount,
          paidAmount: fee.paidAmount,
          pendingAmount: Number(fee.amount) - Number(fee.paidAmount),
          dueDate: fee.dueDate,
          status: fee.status,
          lateFee: fee.lateFee,
        })),
      },
    }
  }

  async recordPayment(user: User, createFeePaymentDto: CreateFeePaymentDto) {
    const { studentFeeId, amount, paymentMethod, transactionId, notes } = createFeePaymentDto

    // Find the student fee
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id: studentFeeId },
      relations: ["student", "feeCategory"],
    })

    if (!studentFee) {
      throw new NotFoundException("Student fee not found")
    }

    // Verify the student belongs to the same school
    if (studentFee.student.schoolId !== user.schoolId) {
      throw new NotFoundException("Student fee not found")
    }

    // Calculate remaining amount
    const remainingAmount = Number(studentFee.amount) - Number(studentFee.paidAmount)

    if (amount > remainingAmount) {
      throw new NotFoundException("Payment amount exceeds pending amount")
    }

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${studentFeeId}`

    // Create payment record
    const payment = this.feePaymentRepository.create({
      studentFeeId,
      amount,
      paymentMethod: paymentMethod as PaymentMethod,
      transactionId,
      receivedBy: user.id,
      receiptNumber,
      notes,
    })

    await this.feePaymentRepository.save(payment)

    // Update student fee
    const newPaidAmount = Number(studentFee.paidAmount) + amount
    studentFee.paidAmount = newPaidAmount
    studentFee.paymentDate = new Date()

    // Update status
    if (newPaidAmount >= Number(studentFee.amount)) {
      studentFee.status = FeeStatus.PAID
    } else {
      studentFee.status = FeeStatus.PARTIAL
    }

    await this.studentFeeRepository.save(studentFee)

    return {
      status: 1,
      message: "Payment recorded successfully",
      data: {
        payment,
        receiptNumber,
        remainingAmount: Number(studentFee.amount) - newPaidAmount,
      },
    }
  }

  async getFeeCollectionReport(schoolId: number, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const end = endDate ? new Date(endDate) : new Date()

    const payments = await this.feePaymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.studentFee", "fee")
      .leftJoinAndSelect("fee.student", "student")
      .leftJoinAndSelect("fee.feeCategory", "category")
      .where("student.schoolId = :schoolId", { schoolId })
      .andWhere("payment.paymentDate BETWEEN :start AND :end", { start, end })
      .orderBy("payment.paymentDate", "DESC")
      .getMany()

    const totalCollection = payments.reduce((sum, payment) => sum + Number(payment.amount), 0)

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

    const methodWise = payments.reduce(
      (acc, payment) => {
        if (!acc[payment.paymentMethod]) {
          acc[payment.paymentMethod] = 0
        }
        acc[payment.paymentMethod] += Number(payment.amount)
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      status: 1,
      message: "Fee collection report retrieved successfully",
      data: {
        period: {
          startDate: start,
          endDate: end,
        },
        summary: {
          totalCollection,
          totalTransactions: payments.length,
        },
        categoryWise,
        methodWise,
        payments: payments.map((payment) => ({
          id: payment.id,
          studentName: payment.studentFee.student.fullName,
          studentId: payment.studentFee.student.studentId,
          category: payment.studentFee.feeCategory.name,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          paymentDate: payment.paymentDate,
          transactionId: payment.transactionId,
          receiptNumber: payment.receiptNumber,
        })),
      },
    }
  }
}
