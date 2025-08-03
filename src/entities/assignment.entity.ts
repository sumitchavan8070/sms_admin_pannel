import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"
import { School } from "./school.entity"
import { Class } from "./class.entity"
import { Subject } from "./subject.entity"
import { User } from "./user.entity"
import { AssignmentSubmission } from "./assignment-submission.entity"

export enum AssignmentStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  CLOSED = "closed",
}

@Entity("assignments")
export class Assignment {
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

  @Column({ length: 255 })
  title: string

  @Column({ type: "text" })
  description: string

  @Column({ type: "text", nullable: true })
  instructions: string

  @Column({ type: "json", nullable: true })
  attachments: string[]

  @Column({ type: "datetime" })
  dueDate: Date

  @Column({ type: "int", default: 100 })
  maxMarks: number

  @Column({ type: "enum", enum: AssignmentStatus, default: AssignmentStatus.DRAFT })
  status: AssignmentStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

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

  @OneToMany(
    () => AssignmentSubmission,
    (submission) => submission.assignment,
  )
  submissions: AssignmentSubmission[]
}
