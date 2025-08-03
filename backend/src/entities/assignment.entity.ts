import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { Subject } from "./subject.entity"
import { Class } from "./class.entity"
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

  @Column({ length: 255 })
  title: string

  @Column({ type: "text" })
  description: string

  @Column({ type: "text", nullable: true })
  instructions: string

  @Column({ type: "datetime" })
  dueDate: Date

  @Column({ type: "int", default: 100 })
  maxMarks: number

  @Column({ type: "enum", enum: AssignmentStatus, default: AssignmentStatus.DRAFT })
  status: AssignmentStatus

  @Column({ type: "json", nullable: true })
  attachments: string[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => Subject,
    (subject) => subject.id,
  )
  @JoinColumn({ name: "subjectId" })
  subject: Subject

  @Column()
  subjectId: number

  @ManyToOne(
    () => Class,
    (classEntity) => classEntity.id,
  )
  @JoinColumn({ name: "classId" })
  class: Class

  @Column()
  classId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  @JoinColumn({ name: "teacherId" })
  teacher: User

  @Column()
  teacherId: number

  @OneToMany(
    () => AssignmentSubmission,
    (submission) => submission.assignment,
  )
  submissions: AssignmentSubmission[]
}
