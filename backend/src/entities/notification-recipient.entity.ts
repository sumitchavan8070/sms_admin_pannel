import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Notification } from "./notification.entity"
import { User } from "./user.entity"

@Entity("notification_recipients")
export class NotificationRecipient {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  isRead: boolean

  @Column({ type: "datetime", nullable: true })
  readAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => Notification,
    (notification) => notification.recipients,
  )
  @JoinColumn({ name: "notificationId" })
  notification: Notification

  @Column()
  notificationId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  @JoinColumn({ name: "recipientId" })
  recipient: User

  @Column()
  recipientId: number
}
