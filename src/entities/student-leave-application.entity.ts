import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "./user.entity"
import { LeaveType } from "./leave-type.entity"
import { LeaveStatus } from "./staff-leave-application.entity"

@Entity("student_leave_applications")
export class StudentLeaveApplication {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  studentId: number

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

  @Column({ type: "enum", enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus

  @Column()
  appliedBy: number

  @Column({ nullable: true })
  approvedBy: number

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date

  @Column({ type: "text", nullable: true })
  rejectionReason: string

  @CreateDateColumn()
  appliedDate: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "studentId" })
  student: User

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: "leaveTypeId" })
  leaveType: LeaveType

  @ManyToOne(() => User)
  @JoinColumn({ name: "appliedBy" })
  appliedByUser: User

  @ManyToOne(() => User)
  @JoinColumn({ name: "approvedBy" })
  approvedByUser: User
}
