import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Notification } from "./notification.entity"
import { User } from "./user.entity"

@Entity("notification_recipients")
export class NotificationRecipient {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  notificationId: number

  @Column()
  userId: number

  @Column({ type: "boolean", default: false })
  isRead: boolean

  @Column({ type: "timestamp", nullable: true })
  readAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Notification)
  @JoinColumn({ name: "notificationId" })
  notification: Notification

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User
}
