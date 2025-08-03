import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "./user.entity"
import { School } from "./school.entity"

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

  @Column()
  schoolId: number

  @Column({ nullable: true })
  userId: number

  @Column({ type: "enum", enum: AuditAction })
  action: AuditAction

  @Column({ length: 100 })
  entityType: string

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

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User
}
