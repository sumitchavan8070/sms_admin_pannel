import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Assignment } from "./assignment.entity"
import { User } from "./user.entity"

export enum SubmissionStatus {
  SUBMITTED = "submitted",
  GRADED = "graded",
  RETURNED = "returned",
}

@Entity("assignment_submissions")
export class AssignmentSubmission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "text", nullable: true })
  content: string

  @Column({ type: "json", nullable: true })
  attachments: string[]

  @Column({ type: "datetime" })
  submittedAt: Date

  @Column({ type: "int", nullable: true })
  marks: number

  @Column({ type: "text", nullable: true })
  feedback: string

  @Column({ type: "enum", enum: SubmissionStatus, default: SubmissionStatus.SUBMITTED })
  status: SubmissionStatus

  @Column({ type: "datetime", nullable: true })
  gradedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => Assignment,
    (assignment) => assignment.submissions,
  )
  @JoinColumn({ name: "assignmentId" })
  assignment: Assignment

  @Column()
  assignmentId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  @JoinColumn({ name: "studentId" })
  student: User

  @Column()
  studentId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
    { nullable: true },
  )
  @JoinColumn({ name: "gradedById" })
  gradedBy: User

  @Column({ nullable: true })
  gradedById: number
}
