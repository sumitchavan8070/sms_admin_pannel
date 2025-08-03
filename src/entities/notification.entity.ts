import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { School } from "./school.entity"
import { User } from "./user.entity"

export enum NotificationType {
  GENERAL = "general",
  ATTENDANCE = "attendance",
  FEE = "fee",
  LEAVE = "leave",
  EXAM = "exam",
  EVENT = "event",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column({ length: 255 })
  title: string

  @Column({ type: "text" })
  message: string

  @Column({ type: "enum", enum: NotificationType })
  type: NotificationType

  @Column({ type: "enum", enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority

  @Column({ type: "json", nullable: true })
  targetRoles: string[]

  @Column({ type: "json", nullable: true })
  targetUsers: number[]

  @Column()
  createdBy: number

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdBy" })
  createdByUser: User
}
