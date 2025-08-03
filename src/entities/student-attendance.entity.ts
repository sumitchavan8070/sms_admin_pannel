import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "./user.entity"
import { Class } from "./class.entity"

export enum StudentAttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
  EXCUSED = "excused",
}

@Entity("student_attendance")
export class StudentAttendance {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  studentId: number

  @Column()
  classId: number

  @Column({ type: "date" })
  date: Date

  @Column({ type: "enum", enum: StudentAttendanceStatus })
  status: StudentAttendanceStatus

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ nullable: true })
  markedBy: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.studentAttendance,
  )
  @JoinColumn({ name: "studentId" })
  student: User

  @ManyToOne(
    () => Class,
    (classEntity) => classEntity.studentAttendance,
  )
  @JoinColumn({ name: "classId" })
  class: Class

  @ManyToOne(() => User)
  @JoinColumn({ name: "markedBy" })
  markedByUser: User
}
