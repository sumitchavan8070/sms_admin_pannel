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
import { LeaveType } from "./leave-type.entity"

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

@Entity("staff_leave_applications")
export class StaffLeaveApplication {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "date" })
  startDate: Date

  @Column({ type: "date" })
  endDate: Date

  @Column({ type: "int" })
  totalDays: number

  @Column({ type: "text" })
  reason: string

  @Column({ type: "enum", enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus

  @Column({ type: "text", nullable: true })
  approverRemarks: string

  @Column({ type: "date", nullable: true })
  appliedDate: Date

  @Column({ type: "date", nullable: true })
  approvedDate: Date

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
    () => LeaveType,
    (leaveType) => leaveType.id,
  )
  @JoinColumn({ name: "leaveTypeId" })
  leaveType: LeaveType

  @Column()
  leaveTypeId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
    { nullable: true },
  )
  @JoinColumn({ name: "approvedById" })
  approvedBy: User

  @Column({ nullable: true })
  approvedById: number
}
