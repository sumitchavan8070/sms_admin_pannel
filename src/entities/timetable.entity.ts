import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { School } from "./school.entity"
import { Class } from "./class.entity"
import { Subject } from "./subject.entity"
import { User } from "./user.entity"

@Entity("timetables")
export class Timetable {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column()
  classId: number

  @Column()
  subjectId: number

  @Column()
  teacherId: number

  @Column({ type: "enum", enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] })
  dayOfWeek: string

  @Column({ type: "time" })
  startTime: string

  @Column({ type: "time" })
  endTime: string

  @Column({ length: 50, nullable: true })
  room: string

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School

  @ManyToOne(() => Class)
  @JoinColumn({ name: "classId" })
  class: Class

  @ManyToOne(() => Subject)
  @JoinColumn({ name: "subjectId" })
  subject: Subject

  @ManyToOne(() => User)
  @JoinColumn({ name: "teacherId" })
  teacher: User
}
