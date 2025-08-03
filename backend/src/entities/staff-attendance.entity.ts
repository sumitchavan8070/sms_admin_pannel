import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
  HALF_DAY = "half_day",
}

@Entity("staff_attendance")
export class StaffAttendance {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "date" })
  date: Date

  @Column({ type: "time", nullable: true })
  checkInTime: string

  @Column({ type: "time", nullable: true })
  checkOutTime: string

  @Column({ type: "enum", enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  status: AttendanceStatus

  @Column({ type: "text", nullable: true })
  remarks: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.staffAttendances,
  )
  @JoinColumn({ name: "staffId" })
  staff: User

  @Column()
  staffId: number
}
