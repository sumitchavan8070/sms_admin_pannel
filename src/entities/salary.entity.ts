import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "./user.entity"

@Entity("salaries")
export class Salary {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  staffId: number

  @Column({ type: "int" })
  month: number

  @Column({ type: "int" })
  year: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  basicSalary: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  allowances: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  deductions: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  netSalary: number

  @Column({ type: "enum", enum: ["pending", "paid"], default: "pending" })
  status: string

  @Column({ type: "timestamp", nullable: true })
  paidDate: Date

  @Column({ nullable: true })
  paidBy: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "staffId" })
  staff: User

  @ManyToOne(() => User)
  @JoinColumn({ name: "paidBy" })
  paidByUser: User
}
