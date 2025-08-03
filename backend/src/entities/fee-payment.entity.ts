import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { StudentFee } from "./student-fee.entity"

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  ONLINE = "online",
  CHEQUE = "cheque",
}

export enum PaymentStatus {
  SUCCESS = "success",
  PENDING = "pending",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

@Entity("fee_payments")
export class FeePayment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ type: "enum", enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.SUCCESS })
  status: PaymentStatus

  @Column({ length: 100, nullable: true })
  transactionId: string

  @Column({ length: 100, nullable: true })
  receiptNumber: string

  @Column({ type: "text", nullable: true })
  remarks: string

  @Column({ type: "date" })
  paymentDate: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  @JoinColumn({ name: "studentId" })
  student: User

  @Column()
  studentId: number

  @ManyToOne(
    () => StudentFee,
    (studentFee) => studentFee.id,
  )
  @JoinColumn({ name: "studentFeeId" })
  studentFee: StudentFee

  @Column()
  studentFeeId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
    { nullable: true },
  )
  @JoinColumn({ name: "collectedById" })
  collectedBy: User

  @Column({ nullable: true })
  collectedById: number
}
