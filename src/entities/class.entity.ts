import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { School } from "./school.entity"
import { User } from "./user.entity"
import { StudentAttendance } from "./student-attendance.entity"

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 10, nullable: true })
  section: string

  @Column({ nullable: true })
  classTeacherId: number

  @Column({ type: "int", default: 0 })
  capacity: number

  @Column({ type: "text", nullable: true })
  description: string

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School

  @ManyToOne(() => User)
  @JoinColumn({ name: "classTeacherId" })
  classTeacher: User

  @OneToMany(
    () => StudentAttendance,
    (attendance) => attendance.class,
  )
  studentAttendance: StudentAttendance[]
}
