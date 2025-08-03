import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { Subject } from "./subject.entity"

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

  @Column({ type: "date" })
  date: Date

  @Column({ type: "enum", enum: StudentAttendanceStatus, default: StudentAttendanceStatus.PRESENT })
  status: StudentAttendanceStatus

  @Column({ type: "text", nullable: true })
  remarks: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.studentAttendances,
  )
  @JoinColumn({ name: "studentId" })
  student: User

  @Column()
  studentId: number

  @ManyToOne(
    () => Subject,
    (subject) => subject.id,
    { nullable: true },
  )
  @JoinColumn({ name: "subjectId" })
  subject: Subject

  @Column({ nullable: true })
  subjectId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
    { nullable: true },
  )
  @JoinColumn({ name: "markedById" })
  markedBy: User

  @Column({ nullable: true })
  markedById: number
}
