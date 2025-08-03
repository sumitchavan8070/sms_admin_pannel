import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column()
  assignmentId: number

  @Column()
  studentId: number

  @Column({ type: "text", nullable: true })
  content: string

  @Column({ type: "json", nullable: true })
  attachments: string[]

  @Column({ type: "enum", enum: SubmissionStatus, default: SubmissionStatus.SUBMITTED })
  status: SubmissionStatus

  @Column({ type: "int", nullable: true })
  marks: number

  @Column({ type: "text", nullable: true })
  feedback: string

  @Column({ nullable: true })
  gradedBy: number

  @Column({ type: "datetime", nullable: true })
  gradedAt: Date

  @CreateDateColumn()
  submittedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => Assignment,
    (assignment) => assignment.submissions,
  )
  @JoinColumn({ name: "assignmentId" })
  assignment: Assignment

  @ManyToOne(() => User)
  @JoinColumn({ name: "studentId" })
  student: User

  @ManyToOne(() => User)
  @JoinColumn({ name: "gradedBy" })
  gradedByUser: User
}
