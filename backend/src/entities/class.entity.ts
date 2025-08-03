import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { School } from "./school.entity"
import { User } from "./user.entity"
import { Subject } from "./subject.entity"

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 10 })
  grade: string

  @Column({ length: 10, nullable: true })
  section: string

  @Column({ type: "int", default: 0 })
  capacity: number

  @Column({ length: 100, nullable: true })
  room: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => School,
    (school) => school.classes,
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
  @JoinColumn({ name: "classTeacherId" })
  classTeacher: User

  @Column({ nullable: true })
  classTeacherId: number

  @OneToMany(
    () => User,
    (user) => user.class,
  )
  students: User[]

  @ManyToMany(
    () => Subject,
    (subject) => subject.classes,
  )
  @JoinTable({
    name: "class_subjects",
    joinColumn: { name: "classId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "subjectId", referencedColumnName: "id" },
  })
  subjects: Subject[]
}
