import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { User } from "./user.entity"

export enum RoleName {
  ADMIN = "admin",
  PRINCIPAL = "principal",
  TEACHER = "teacher",
  STUDENT = "student",
  PARENT = "parent",
  STAFF = "staff",
}

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "enum", enum: RoleName, unique: true })
  name: RoleName

  @Column({ length: 255, nullable: true })
  description: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => User,
    (user) => user.role,
  )
  users: User[]
}
