import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { User } from "./user.entity"
import { Class } from "./class.entity"
import { Subject } from "./subject.entity"

@Entity("schools")
export class School {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  name: string

  @Column({ length: 255, nullable: true })
  address: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ length: 255, nullable: true })
  email: string

  @Column({ length: 255, nullable: true })
  website: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => User,
    (user) => user.school,
  )
  users: User[]

  @OneToMany(
    () => Class,
    (classEntity) => classEntity.school,
  )
  classes: Class[]

  @OneToMany(
    () => Subject,
    (subject) => subject.school,
  )
  subjects: Subject[]
}
