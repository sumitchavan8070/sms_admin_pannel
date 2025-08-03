import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm"
import { School } from "./school.entity"
import { User } from "./user.entity"
import { Class } from "./class.entity"

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 20, unique: true })
  code: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "int", default: 0 })
  credits: number

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => School,
    (school) => school.subjects,
  )
  @JoinColumn({ name: "schoolId" })
  school: School

  @Column()
  schoolId: number

  @ManyToOne(
    () => User,
    (user) => user.id,
    { nullable: true },
  )
  @JoinColumn({ name: "teacherId" })
  teacher: User

  @Column({ nullable: true })
  teacherId: number

  @ManyToMany(
    () => Class,
    (classEntity) => classEntity.subjects,
  )
  classes: Class[]
}
