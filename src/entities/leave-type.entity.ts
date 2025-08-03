import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { School } from "./school.entity"

@Entity("leave_types")
export class LeaveType {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column({ length: 100 })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "int", default: 0 })
  maxDaysPerYear: number

  @Column({ type: "boolean", default: false })
  requiresMedicalCertificate: boolean

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School
}
