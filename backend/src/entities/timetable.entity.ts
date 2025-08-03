import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Class } from "./class.entity"
import { Subject } from "./subject.entity"
import { User } from "./user.entity"

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

@Entity("timetables")
export class Timetable {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "enum", enum: DayOfWeek })
  dayOfWeek: DayOfWeek

  @Column({ type: "time" })
  startTime: string

  @Column({ type: "time" })
  endTime: string

  @Column({ length: 100, nullable: true })
  room: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => Class,
    (classEntity) => classEntity.id,
  )
  @JoinColumn({ name: "classId" })
  class: Class

  @Column()
  classId: number

  @ManyToOne(
    () => Subject,
    (subject) => subject.id,
  )
  @JoinColumn({ name: "subjectId" })
  subject: Subject

  @Column()
  subjectId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  @JoinColumn({ name: "teacherId" })
  teacher: User

  @Column()
  teacherId: number
}
