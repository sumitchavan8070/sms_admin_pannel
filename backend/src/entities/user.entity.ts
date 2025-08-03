import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index, // Added for database indexing
} from "typeorm";
import { Exclude } from "class-transformer";
import { School } from "./school.entity";
import { Role } from "./role.entity";
import { Class } from "./class.entity";
import { StaffAttendance } from "./staff-attendance.entity";
import { StudentAttendance } from "./student-attendance.entity";

// Enums should be declared before the entity
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Entity("users")
@Index(["email"], { unique: true }) // Index for performance and uniqueness
@Index(["studentId"], { unique: true, where: "studentId IS NOT NULL" })
@Index(["employeeId"], { unique: true, where: "employeeId IS NOT NULL" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // The `name` property is explicitly used here for clarity, though it's optional
  // when the property name and column name are identical.
  @Column({ name: "firstName" })
  firstName: string;

  @Column({ name: "lastName" })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Use @Exclude() to prevent the password from being returned in queries
  password: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date;

  @Column({ type: "enum", enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ length: 50, nullable: true, unique: true })
  studentId: string;

  @Column({ length: 50, nullable: true, unique: true })
  employeeId: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: "date", nullable: true })
  joinDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => School, (school) => school.users)
  @JoinColumn({ name: "schoolId" })
  school: School;

  @Column({ name: "schoolId" })
  schoolId: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @Column({ name: "roleId" })
  roleId: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.students, {
    nullable: true,
  })
  @JoinColumn({ name: "classId" })
  class: Class;

  @Column({ name: "classId", nullable: true })
  classId: number;

  // One-to-many relationships
  @OneToMany(() => StaffAttendance, (attendance) => attendance.staff)
  staffAttendances: StaffAttendance[];

  @OneToMany(() => StudentAttendance, (attendance) => attendance.student)
  studentAttendances: StudentAttendance[];
}
