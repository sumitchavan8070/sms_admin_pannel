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

export enum SalaryStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}

@Entity("salaries")
export class Salary {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  basicSalary: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  allowances: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  deductions: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  netSalary: number

  @Column({ type: "int" })
  month: number

  @Column({ type: "int" })
  year: number

  @Column({ type: "enum", enum: SalaryStatus, default: SalaryStatus.PENDING })
  status: SalaryStatus

  @Column({ type: "date", nullable: true })
  paidDate: Date

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
  @JoinColumn({ name: "staffId" })
  staff: User

  @Column()
  staffId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
    { nullable: true },
  )
  @JoinColumn({ name: "processedById" })
  processedBy: User

  @Column({ nullable: true })
  processedById: number
}
