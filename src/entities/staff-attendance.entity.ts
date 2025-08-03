import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
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

  @Column()
  staffId: number

  @Column({ type: "date" })
  date: Date

  @Column({ type: "enum", enum: AttendanceStatus })
  status: AttendanceStatus

  @Column({ type: "time", nullable: true })
  checkInTime: string

  @Column({ type: "time", nullable: true })
  checkOutTime: string

  @Column({ type: "decimal", precision: 4, scale: 2, nullable: true })
  workingHours: number

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ nullable: true })
  markedBy: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.staffAttendance,
  )
  @JoinColumn({ name: "staffId" })
  staff: User

  @ManyToOne(() => User)
  @JoinColumn({ name: "markedBy" })
  markedByUser: User
}
