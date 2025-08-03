import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { School } from "./school.entity"

@Entity("fee_categories")
export class FeeCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column({ length: 100 })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ type: "enum", enum: ["monthly", "quarterly", "yearly", "one_time"], default: "monthly" })
  frequency: string

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School
}
