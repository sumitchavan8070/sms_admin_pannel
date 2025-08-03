import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"
import { School } from "./school.entity"
import { Role } from "./role.entity"
import { StaffAttendance } from "./staff-attendance.entity"
import { StudentAttendance } from "./student-attendance.entity"

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column()
  roleId: number

  @Column({ length: 255, unique: true })
  email: string

  @Column({ length: 255 })
  passwordHash: string

  @Column({ length: 100 })
  firstName: string

  @Column({ length: 100 })
  lastName: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ type: "text", nullable: true })
  address: string

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date

  @Column({ type: "enum", enum: ["male", "female", "other"], nullable: true })
  gender: string

  @Column({ length: 100, nullable: true })
  department: string

  @Column({ length: 100, nullable: true })
  designation: string

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  salary: number

  @Column({ length: 50, nullable: true, unique: true })
  employeeId: string

  @Column({ length: 50, nullable: true, unique: true })
  studentId: string

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus

  @Column({ type: "date", nullable: true })
  joinDate: Date

  @Column({ type: "timestamp", nullable: true })
  lastLogin: Date

  @Column({ type: "text", nullable: true })
  profileImage: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => School,
    (school) => school.users,
  )
  @JoinColumn({ name: "schoolId" })
  school: School

  @ManyToOne(
    () => Role,
    (role) => role.users,
  )
  @JoinColumn({ name: "roleId" })
  role: Role

  @OneToMany(
    () => StaffAttendance,
    (attendance) => attendance.staff,
  )
  staffAttendance: StaffAttendance[]

  @OneToMany(
    () => StudentAttendance,
    (attendance) => attendance.student,
  )
  studentAttendance: StudentAttendance[]

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
