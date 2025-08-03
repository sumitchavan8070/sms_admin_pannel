import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Timetable } from "@/entities/timetable.entity"
import { Class } from "@/entities/class.entity"
import { Subject } from "@/entities/subject.entity"
import { User } from "@/entities/user.entity"
import { RoleName } from "@/entities/role.entity"
import type { CreateTimetableDto } from "./dto/create-timetable.dto"
import type { UpdateTimetableDto } from "./dto/update-timetable.dto"

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private timetableRepository: Repository<Timetable>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTimetableDto: CreateTimetableDto, currentUser: User) {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } = createTimetableDto

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions")
    }

    // Verify class exists
    const classEntity = await this.classRepository.findOne({ where: { id: classId } })
    if (!classEntity) {
      throw new NotFoundException("Class not found")
    }

    // Verify subject exists
    const subject = await this.subjectRepository.findOne({ where: { id: subjectId } })
    if (!subject) {
      throw new NotFoundException("Subject not found")
    }

    // Verify teacher exists
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
      relations: ["role"],
    })
    if (!teacher || teacher.role.name !== RoleName.TEACHER) {
      throw new NotFoundException("Teacher not found")
    }

    // Check for conflicts
    const existingEntry = await this.timetableRepository.findOne({
      where: {
        classId,
        dayOfWeek,
        startTime,
        isActive: true,
      },
    })

    if (existingEntry) {
      throw new BadRequestException("Time slot already occupied for this class")
    }

    // Check teacher availability
    const teacherConflict = await this.timetableRepository.findOne({
      where: {
        teacherId,
        dayOfWeek,
        startTime,
        isActive: true,
      },
    })

    if (teacherConflict) {
      throw new BadRequestException("Teacher is not available at this time")
    }

    const timetableEntry = this.timetableRepository.create({
      classId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      room,
    })

    return this.timetableRepository.save(timetableEntry)
  }

  async findAll(filters: any, currentUser: User) {
    const { classId, teacherId, dayOfWeek } = filters

    const queryBuilder = this.timetableRepository
      .createQueryBuilder("timetable")
      .leftJoinAndSelect("timetable.class", "class")
      .leftJoinAndSelect("timetable.subject", "subject")
      .leftJoinAndSelect("timetable.teacher", "teacher")
      .where("timetable.isActive = :isActive", { isActive: true })

    // Apply school filter based on user role
    if (currentUser.role.name !== RoleName.ADMIN) {
      queryBuilder.andWhere("class.schoolId = :schoolId", { schoolId: currentUser.schoolId })
    }

    if (classId) {
      queryBuilder.andWhere("timetable.classId = :classId", { classId })
    }

    if (teacherId) {
      queryBuilder.andWhere("timetable.teacherId = :teacherId", { teacherId })
    }

    if (dayOfWeek) {
      queryBuilder.andWhere("timetable.dayOfWeek = :dayOfWeek", { dayOfWeek })
    }

    return queryBuilder.orderBy("timetable.startTime", "ASC").getMany()
  }

  async findOne(id: number, currentUser: User) {
    const timetableEntry = await this.timetableRepository.findOne({
      where: { id },
      relations: ["class", "subject", "teacher"],
    })

    if (!timetableEntry) {
      throw new NotFoundException("Timetable entry not found")
    }

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && timetableEntry.class.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return timetableEntry
  }

  async update(id: number, updateTimetableDto: UpdateTimetableDto, currentUser: User) {
    const timetableEntry = await this.findOne(id, currentUser)

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.timetableRepository.update(id, updateTimetableDto)
    return this.findOne(id, currentUser)
  }

  async remove(id: number, currentUser: User) {
    const timetableEntry = await this.findOne(id, currentUser)

    // Check permissions
    if (currentUser.role.name !== RoleName.ADMIN && currentUser.role.name !== RoleName.PRINCIPAL) {
      throw new ForbiddenException("Insufficient permissions")
    }

    await this.timetableRepository.update(id, { isActive: false })
    return { message: "Timetable entry deleted successfully" }
  }

  async getWeeklyTimetable(classId: number, currentUser: User) {
    // Verify class exists and check permissions
    const classEntity = await this.classRepository.findOne({ where: { id: classId } })
    if (!classEntity) {
      throw new NotFoundException("Class not found")
    }

    if (currentUser.role.name !== RoleName.ADMIN && classEntity.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException("Insufficient permissions")
    }

    const timetable = await this.timetableRepository.find({
      where: { classId, isActive: true },
      relations: ["subject", "teacher"],
      order: { dayOfWeek: "ASC", startTime: "ASC" },
    })

    // Group by day of week
    const weeklySchedule = timetable.reduce((acc, entry) => {
      if (!acc[entry.dayOfWeek]) {
        acc[entry.dayOfWeek] = []
      }
      acc[entry.dayOfWeek].push(entry)
      return acc
    }, {})

    return weeklySchedule
  }

  async getTeacherSchedule(teacherId: number, currentUser: User) {
    // Verify teacher exists
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
      relations: ["role", "school"],
    })
    if (!teacher || teacher.role.name !== RoleName.TEACHER) {
      throw new NotFoundException("Teacher not found")
    }

    // Check permissions
    if (
      currentUser.role.name !== RoleName.ADMIN &&
      teacher.schoolId !== currentUser.schoolId &&
      currentUser.id !== teacherId
    ) {
      throw new ForbiddenException("Insufficient permissions")
    }

    const schedule = await this.timetableRepository.find({
      where: { teacherId, isActive: true },
      relations: ["class", "subject"],
      order: { dayOfWeek: "ASC", startTime: "ASC" },
    })

    // Group by day of week
    const weeklySchedule = schedule.reduce((acc, entry) => {
      if (!acc[entry.dayOfWeek]) {
        acc[entry.dayOfWeek] = []
      }
      acc[entry.dayOfWeek].push(entry)
      return acc
    }, {})

    return weeklySchedule
  }
}
