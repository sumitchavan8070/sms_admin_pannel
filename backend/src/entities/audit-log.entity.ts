import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
}

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "enum", enum: AuditAction })
  action: AuditAction

  @Column({ length: 100 })
  entityName: string

  @Column({ nullable: true })
  entityId: number

  @Column({ type: "json", nullable: true })
  oldValues: any

  @Column({ type: "json", nullable: true })
  newValues: any

  @Column({ length: 45, nullable: true })
  ipAddress: string

  @Column({ length: 255, nullable: true })
  userAgent: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.id,
    { nullable: true },
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column({ nullable: true })
  userId: number
}
