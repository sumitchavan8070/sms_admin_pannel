import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { User } from "./user.entity"

@Entity("schools")
export class School {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  name: string

  @Column({ type: "text", nullable: true })
  address: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ length: 255, nullable: true })
  email: string

  @Column({ length: 255, nullable: true })
  website: string

  @Column({ type: "text", nullable: true })
  logoUrl: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => User,
    (user) => user.school,
  )
  users: User[]
}
