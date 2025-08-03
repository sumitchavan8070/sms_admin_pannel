import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "./user.entity"
import { LeaveType } from "./leave-type.entity"

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity("staff_leave_applications")
export class StaffLeaveApplication {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  staffId: number

  @Column()
  leaveTypeId: number

  @Column({ type: "date" })
  startDate: Date

  @Column({ type: "date" })
  endDate: Date

  @Column({ type: "int" })
  totalDays: number

  @Column({ type: "text" })
  reason: string

  @Column({ type: "text", nullable: true })
  medicalCertificate: string

  @Column({ type: "enum", enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus

  @Column({ nullable: true })
  approvedBy: number

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date

  @Column({ type: "text", nullable: true })
  rejectionReason: string

  @CreateDateColumn()
  appliedDate: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "staffId" })
  staff: User

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: "leaveTypeId" })
  leaveType: LeaveType

  @ManyToOne(() => User)
  @JoinColumn({ name: "approvedBy" })
  approvedByUser: User
}
