import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "./user.entity"
import { FeeCategory } from "./fee-category.entity"

export enum FeeStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
  PARTIAL = "partial",
}

@Entity("student_fees")
export class StudentFee {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  paidAmount: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  remainingAmount: number

  @Column({ type: "date" })
  dueDate: Date

  @Column({ type: "enum", enum: FeeStatus, default: FeeStatus.PENDING })
  status: FeeStatus

  @Column({ type: "text", nullable: true })
  remarks: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  @JoinColumn({ name: "studentId" })
  student: User

  @Column()
  studentId: number

  @ManyToOne(
    () => FeeCategory,
    (feeCategory) => feeCategory.id,
  )
  @JoinColumn({ name: "feeCategoryId" })
  feeCategory: FeeCategory

  @Column()
  feeCategoryId: number
}
