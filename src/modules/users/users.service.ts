import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { type Repository, Like } from "typeorm"
import { type User, UserStatus } from "../../entities/user.entity"
import type { Role } from "../../entities/role.entity"
import * as bcrypt from "bcrypt"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"

interface GetUsersFilters {
  role?: string
  department?: string
  search?: string
  page?: number
  limit?: number
}

@Injectable()
export class UsersService {
  constructor(
    private userRepository: Repository<User>,
    private roleRepository: Repository<Role>,
  ) {}

  async getUsers(schoolId: number, filters: GetUsersFilters) {
    const { role, department, search, page = 1, limit = 10 } = filters

    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.schoolId = :schoolId", { schoolId })

    if (role) {
      queryBuilder.andWhere("role.name = :role", { role })
    }

    if (department) {
      queryBuilder.andWhere("user.department = :department", { department })
    }

    if (search) {
      queryBuilder.andWhere("(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)", {
        search: `%${search}%`,
      })
    }

    const [users, total] = await queryBuilder
      .orderBy("user.firstName", "ASC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      status: 1,
      message: "Users retrieved successfully",
      data: {
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role.name,
          department: user.department,
          designation: user.designation,
          employeeId: user.employeeId,
          studentId: user.studentId,
          status: user.status,
          joinDate: user.joinDate,
          lastLogin: user.lastLogin,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  }

  async getUserById(schoolId: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, schoolId },
      relations: ["role"],
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return {
      status: 1,
      message: "User retrieved successfully",
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role.name,
        department: user.department,
        designation: user.designation,
        salary: user.salary,
        employeeId: user.employeeId,
        studentId: user.studentId,
        status: user.status,
        joinDate: user.joinDate,
        lastLogin: user.lastLogin,
        profileImage: user.profileImage,
      },
    }
  }

  async createUser(currentUser: User, createUserDto: CreateUserDto) {
    const { email, firstName, lastName, roleId, phone, department, designation, salary, password } = createUserDto

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException("Email already exists")
    }

    // Validate role
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    })

    if (!role) {
      throw new NotFoundException("Role not found")
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password || "password123", saltRounds)

    // Generate employee/student ID
    let employeeId: string | undefined
    let studentId: string | undefined

    if (
      role.name === "Teacher" ||
      role.name === "Principal" ||
      role.name === "IT Admin" ||
      role.name === "Accountant"
    ) {
      const lastEmployee = await this.userRepository.findOne({
        where: { schoolId: currentUser.schoolId, employeeId: Like("EMP%") },
        order: { employeeId: "DESC" },
      })
      const lastNumber = lastEmployee ? Number.parseInt(lastEmployee.employeeId.replace("EMP", "")) : 0
      employeeId = `EMP${String(lastNumber + 1).padStart(3, "0")}`
    }

    if (role.name === "Student") {
      const lastStudent = await this.userRepository.findOne({
        where: { schoolId: currentUser.schoolId, studentId: Like("STU%") },
        order: { studentId: "DESC" },
      })
      const lastNumber = lastStudent ? Number.parseInt(lastStudent.studentId.replace("STU", "")) : 0
      studentId = `STU${String(lastNumber + 1).padStart(3, "0")}`
    }

    const user = this.userRepository.create({
      schoolId: currentUser.schoolId,
      roleId,
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      department,
      designation,
      salary,
      employeeId,
      studentId,
      joinDate: new Date(),
      status: UserStatus.ACTIVE,
    })

    await this.userRepository.save(user)

    return {
      status: 1,
      message: "User created successfully",
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        employeeId: user.employeeId,
        studentId: user.studentId,
      },
    }
  }

  async updateUser(schoolId: number, userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId, schoolId },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Update user fields
    Object.assign(user, updateUserDto)

    await this.userRepository.save(user)

    return {
      status: 1,
      message: "User updated successfully",
      data: user,
    }
  }

  async deleteUser(schoolId: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, schoolId },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Soft delete by setting status to inactive
    user.status = UserStatus.INACTIVE
    await this.userRepository.save(user)

    return {
      status: 1,
      message: "User deleted successfully",
    }
  }

  async getStaffList(schoolId: number) {
    const staff = await this.userRepository.find({
      where: {
        schoolId,
        roleId: 4, // Teachers
        status: UserStatus.ACTIVE,
      },
      select: ["id", "firstName", "lastName", "department", "designation", "employeeId"],
      order: { firstName: "ASC" },
    })

    return {
      status: 1,
      message: "Staff list retrieved successfully",
      data: staff.map((member) => ({
        id: member.id,
        name: member.fullName,
        department: member.department,
        designation: member.designation,
        employeeId: member.employeeId,
      })),
    }
  }

  async getStudentsList(schoolId: number) {
    const students = await this.userRepository.find({
      where: {
        schoolId,
        roleId: 5, // Students
        status: UserStatus.ACTIVE,
      },
      select: ["id", "firstName", "lastName", "studentId"],
      order: { firstName: "ASC" },
    })

    return {
      status: 1,
      message: "Students list retrieved successfully",
      data: students.map((student) => ({
        id: student.id,
        name: student.fullName,
        studentId: student.studentId,
      })),
    }
  }
}
