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
import { User } from "./user.entity"
import { NotificationRecipient } from "./notification-recipient.entity"

export enum NotificationType {
  GENERAL = "general",
  ACADEMIC = "academic",
  ATTENDANCE = "attendance",
  FEE = "fee",
  LEAVE = "leave",
  EMERGENCY = "emergency",
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

  @Column({ length: 255 })
  title: string

  @Column({ type: "text" })
  message: string

  @Column({ type: "enum", enum: NotificationType, default: NotificationType.GENERAL })
  type: NotificationType

  @Column({ type: "enum", enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority

  @Column({ type: "datetime", nullable: true })
  scheduledAt: Date

  @Column({ default: false })
  isSent: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  @JoinColumn({ name: "senderId" })
  sender: User

  @Column()
  senderId: number

  @OneToMany(
    () => NotificationRecipient,
    (recipient) => recipient.notification,
  )
  recipients: NotificationRecipient[]
}
