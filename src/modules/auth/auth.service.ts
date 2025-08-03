import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"

import type { User } from "../../entities/user.entity"
import type { Role } from "../../entities/role.entity"
import type { School } from "../../entities/school.entity"
import type { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
  private userRepository: Repository<User>
  private roleRepository: Repository<Role>
  private schoolRepository: Repository<School>

  constructor(
    userRepository: Repository<User>,
    roleRepository: Repository<Role>,
    schoolRepository: Repository<School>,
    private jwtService: JwtService,
  ) {
    this.userRepository = userRepository
    this.roleRepository = roleRepository
    this.schoolRepository = schoolRepository
  }

  async login(loginDto: LoginDto) {
    const { email, password, schoolId, roleId } = loginDto

    // Find user with relations
    const user = await this.userRepository.findOne({
      where: {
        email,
        schoolId: Number.parseInt(schoolId),
        roleId: Number.parseInt(roleId),
        status: "active",
      },
      relations: ["role", "school"],
    })

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Update last login
    await this.userRepository.update(user.id, { lastLogin: new Date() })

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      schoolId: user.schoolId,
      roleId: user.roleId,
    }
    const accessToken = this.jwtService.sign(payload)

    return {
      status: 1,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role.name,
          school: user.school.name,
          department: user.department,
          designation: user.designation,
          profileImage: user.profileImage,
        },
      },
    }
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, status: "active" },
      relations: ["role", "school"],
    })

    if (!user) {
      throw new UnauthorizedException("User not found")
    }

    return user
  }

  async getRoles() {
    const roles = await this.roleRepository.find({
      select: ["id", "name", "description"],
      order: { id: "ASC" },
    })

    return {
      status: 1,
      message: "Roles fetched successfully",
      roles,
    }
  }

  async getSchools() {
    const schools = await this.schoolRepository.find({
      select: ["id", "name", "logoUrl", "address"],
      order: { name: "ASC" },
    })

    return {
      status: 1,
      message: "Schools fetched successfully",
      schools,
    }
  }
}
