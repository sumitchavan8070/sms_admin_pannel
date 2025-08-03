import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from '@nestjs/typeorm';
import type { School } from "../../entities/school.entity"
import type { SystemSetting } from "../../entities/system-setting.entity"
import type { CreateSchoolDto } from "./dto/create-school.dto"
import type { UpdateSchoolDto } from "./dto/update-school.dto"
import { Repository } from "typeorm/repository/Repository.js";

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,

    @InjectRepository(SystemSetting)
    private readonly systemSettingRepository: Repository<SystemSetting>,
  ) {}

  async getSchools() {
    const schools = await this.schoolRepository.find({
      order: { name: "ASC" },
    })

    return {
      status: 1,
      message: "Schools retrieved successfully",
      data: schools,
    }
  }

  async getSchoolById(id: number) {
    const school = await this.schoolRepository.findOne({
      where: { id },
    })

    if (!school) {
      throw new NotFoundException("School not found")
    }

    return {
      status: 1,
      message: "School retrieved successfully",
      data: school,
    }
  }

  async createSchool(createSchoolDto: CreateSchoolDto) {
    const school = this.schoolRepository.create(createSchoolDto)
    await this.schoolRepository.save(school)

    return {
      status: 1,
      message: "School created successfully",
      data: school,
    }
  }

  async updateSchool(id: number, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.schoolRepository.findOne({
      where: { id },
    })

    if (!school) {
      throw new NotFoundException("School not found")
    }

    Object.assign(school, updateSchoolDto)
    await this.schoolRepository.save(school)

    return {
      status: 1,
      message: "School updated successfully",
      data: school,
    }
  }

  async deleteSchool(id: number) {
    const school = await this.schoolRepository.findOne({
      where: { id },
    })

    if (!school) {
      throw new NotFoundException("School not found")
    }

    school.status = "inactive"
    await this.schoolRepository.save(school)

    return {
      status: 1,
      message: "School deleted successfully",
    }
  }

  async getSchoolSettings(schoolId: number) {
    const settings = await this.systemSettingRepository.find({
      where: { schoolId },
    })


    return {
      status: 1,
      message: "School settings retrieved successfully",
      data: settings,
    }
  }

  async updateSchoolSettings(schoolId: number, settings: Record<string, any>) {
    for (const [key, value] of Object.entries(settings)) {
      let setting = await this.systemSettingRepository.findOne({
        where: { schoolId, key },
      })

      if (setting) {
        setting.value = String(value)
      } else {
        setting = this.systemSettingRepository.create({
          schoolId,
          key,
          value: String(value),
        })
      }

      await this.systemSettingRepository.save(setting)
    }

    return {
      status: 1,
      message: "School settings updated successfully",
    }
  }
}
