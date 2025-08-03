import { Injectable, NotFoundException, ForbiddenException, ConflictException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Not, QueryFailedError, type Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { User, UserStatus } from "@/entities/user.entity"
import { Role, RoleName } from "@/entities/role.entity"
import { School } from "@/entities/school.entity"
import { Class } from "@/entities/class.entity"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { jwtConfig } from "@/middleware/jwt.config"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService, // ✅ Add this line

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) { }

  async create(createUserDto: CreateUserDto, currentUser: User) {
    // 1. Permission check
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Sorry, you’re not authorized to perform this action");
    }

    // 2. Destructure DTO and hash password
    const { password, roleId, schoolId, classId, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Validate foreign keys
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException("Role not found");

    const school = await this.schoolRepository.findOne({ where: { id: schoolId } });
    if (!school) throw new NotFoundException("School not found");

    let classEntity = null;
    if (classId) {
      classEntity = await this.classRepository.findOne({ where: { id: classId } });
      if (!classEntity) throw new NotFoundException("Class not found");
    }

    // 4. Generate IDs
    let studentId = null;
    let employeeId = null;
    if (role.name === RoleName.STUDENT) {
      studentId = await this.generateStudentId(schoolId);
    } else {
      employeeId = await this.generateEmployeeId(schoolId);
    }

    // 5. Create user entity
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      roleId,
      schoolId,
      classId,
      studentId,
      employeeId,
      status: UserStatus.ACTIVE,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      const userWithRelations = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['role', 'school', 'class'],
      });

      const payload = {
        sub: userWithRelations.id,
        email: userWithRelations.email,
        role: userWithRelations.role.name,
        schoolId: userWithRelations.schoolId,
        roleId: userWithRelations.roleId,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.signOptions.expiresIn,
      });

      return {
        status: 1,
        message: "User created successfully",
        data: {
          user: userWithRelations,
          access_token,
        },
      };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes("Duplicate entry") &&
        error.message.includes("users.email")
      ) {
        throw new ConflictException("User with this email already exists");
      }

      throw error; // rethrow other unexpected errors
    }
  }


  async findAll(filters: any, currentUser: User) {
    const { role, school, page = 1, limit = 10 } = filters

    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.school", "school")
      .leftJoinAndSelect("user.class", "class")

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("user.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    if (role) {
      queryBuilder.andWhere("role.name = :role", { role })
    }

    if (school) {
      queryBuilder.andWhere("user.schoolId = :school", { school })
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number, currentUser: User) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["role", "school", "class"],
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && user.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    const user = await this.findOne(id, currentUser)

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions")
    }

    const { password, ...updateData } = updateUserDto

    if (password) {
      updateData["password"] = await bcrypt.hash(password, 10)
    }

    await this.userRepository.update(id, updateData)
    return this.findOne(id, currentUser)
  }

  async remove(id: number, currentUser: User) {
    const user = await this.findOne(id, currentUser)

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.userRepository.update(id, { status: UserStatus.INACTIVE })
    return { message: "User deactivated successfully" }
  }

  async getStudents(currentUser: User) {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.school", "school")
      .leftJoinAndSelect("user.class", "class")
      .where("role.name = :role", { role: RoleName.STUDENT })

    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("user.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    return queryBuilder.getMany()
  }

  async getTeachers(currentUser: User) {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.school", "school")
      .where("role.name = :role", { role: RoleName.TEACHER })

    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("user.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    return queryBuilder.getMany()
  }

  async getStaff(currentUser: User) {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.school", "school")
      .where("role.name IN (:...roles)", { roles: [RoleName.TEACHER, RoleName.STAFF, RoleName.PRINCIPAL] })

    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("user.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    return queryBuilder.getMany()
  }

  private async generateStudentId(schoolId: number): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.userRepository.count({
      where: { schoolId, studentId: { status: Not('inactive') } as any },
    })
    return `STU${year}${schoolId.toString().padStart(2, "0")}${(count + 1).toString().padStart(4, "0")}`
  }

  private async generateEmployeeId(schoolId: number): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.userRepository.count({
      where: { schoolId, employeeId: { $ne: null } as any },
    })
    return `EMP${year}${schoolId.toString().padStart(2, "0")}${(count + 1).toString().padStart(4, "0")}`
  }
}
