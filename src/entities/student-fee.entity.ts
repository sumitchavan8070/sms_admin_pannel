import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm"
import { User } from "./user.entity"
import { FeeCategory } from "./fee-category.entity"
import { FeePayment } from "./fee-payment.entity"

export enum FeeStatus {
  PENDING = "pending",
  PARTIAL = "partial",
  PAID = "paid",
  OVERDUE = "overdue",
}

@Entity("student_fees")
export class StudentFee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  studentId: number

  @Column()
  feeCategoryId: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  paidAmount: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discount: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  lateFee: number

  @Column({ type: "date" })
  dueDate: Date

  @Column({ type: "enum", enum: FeeStatus, default: FeeStatus.PENDING })
  status: FeeStatus

  @Column({ type: "timestamp", nullable: true })
  paymentDate: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "studentId" })
  student: User

  @ManyToOne(() => FeeCategory)
  @JoinColumn({ name: "feeCategoryId" })
  feeCategory: FeeCategory

  @OneToMany(
    () => FeePayment,
    (payment) => payment.studentFee,
  )
  payments: FeePayment[]
}
