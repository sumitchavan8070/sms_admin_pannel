import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm" // <-- Add this import
import type { Repository } from "typeorm"
import { School } from "@/entities/school.entity" // <-- Remove 'type' here as it's a class
import type { User } from "@/entities/user.entity"
import { RoleName } from "@/entities/role.entity"
import type { CreateSchoolDto } from "./dto/create-school.dto"
import type { UpdateSchoolDto } from "./dto/update-school.dto"

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School) // <-- Add this decorator
    private schoolRepository: Repository<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto, currentUser: User) {
    // Only admin can create schools
    if (currentUser.role.name !== RoleName.ADMIN) {
      throw new ForbiddenException("Only administrators can create schools")
    }

    const school = this.schoolRepository.create(createSchoolDto)
    return this.schoolRepository.save(school)
  }

  async findAll(currentUser: User) {
    // Admin can see all schools, others can only see their own
    if (currentUser.role.name === RoleName.ADMIN) {
      return this.schoolRepository.find({ where: { isActive: true } })
    } else {
      return this.schoolRepository.find({
        where: { id: currentUser.schoolId, isActive: true },
      })
    }
  }

  async findOne(id: number, currentUser: User) {
    const school = await this.schoolRepository.findOne({ where: { id } })

    if (!school) {
      throw new NotFoundException("School not found")
    }

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && school.id !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return school
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto, currentUser: User) {
    const school = await this.findOne(id, currentUser)

    // Only admin and principal can update school details
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.schoolRepository.update(id, updateSchoolDto)
    return this.findOne(id, currentUser)
  }

  async remove(id: number, currentUser: User) {
    const school = await this.findOne(id, currentUser)

    // Only admin can delete schools
    if (currentUser.role.name !== RoleName.ADMIN) {
      throw new ForbiddenException("Only administrators can delete schools")
    }

    await this.schoolRepository.update(id, { isActive: false })
    return { message: "School deactivated successfully" }
  }
}
