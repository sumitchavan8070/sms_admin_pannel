import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Timetable } from "../../entities/timetable.entity"
import type { Class } from "../../entities/class.entity"
import type { Subject } from "../../entities/subject.entity"
import type { User } from "../../entities/user.entity"
import type { CreateTimetableDto } from "./dto/create-timetable.dto"
import type { UpdateTimetableDto } from "./dto/update-timetable.dto"

interface TimetableFilters {
  classId?: number
  teacherId?: number
  dayOfWeek?: string
}

@Injectable()
export class TimetableService {
  constructor(
    private timetableRepository: Repository<Timetable>,
    private classRepository: Repository<Class>,
    private subjectRepository: Repository<Subject>,
    private userRepository: Repository<User>,
  ) {}

  async getTimetable(schoolId: number, filters: TimetableFilters) {
    const queryBuilder = this.timetableRepository
      .createQueryBuilder("timetable")
      .leftJoinAndSelect("timetable.class", "class")
      .leftJoinAndSelect("timetable.subject", "subject")
      .leftJoinAndSelect("timetable.teacher", "teacher")
      .where("timetable.schoolId = :schoolId", { schoolId })
      .andWhere("timetable.isActive = true")

    if (filters.classId) {
      queryBuilder.andWhere("timetable.classId = :classId", { classId: filters.classId })
    }

    if (filters.teacherId) {
      queryBuilder.andWhere("timetable.teacherId = :teacherId", { teacherId: filters.teacherId })
    }

    if (filters.dayOfWeek) {
      queryBuilder.andWhere("timetable.dayOfWeek = :dayOfWeek", { dayOfWeek: filters.dayOfWeek })
    }

    const timetable = await queryBuilder
      .orderBy("timetable.dayOfWeek", "ASC")
      .addOrderBy("timetable.startTime", "ASC")
      .getMany()

    return {
      status: 1,
      message: "Timetable retrieved successfully",
      data: timetable.map((entry) => ({
        id: entry.id,
        className: `${entry.class.name} ${entry.class.section || ""}`.trim(),
        subjectName: entry.subject.name,
        teacherName: entry.teacher.fullName,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
      })),
    }
  }

  async getClassTimetable(schoolId: number, classId: number) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, schoolId },
    })

    if (!classEntity) {
      throw new NotFoundException("Class not found")
    }

    const timetable = await this.timetableRepository.find({
      where: { classId, isActive: true },
      relations: ["subject", "teacher"],
      order: { dayOfWeek: "ASC", startTime: "ASC" },
    })

    // Group by day of week
    const weeklyTimetable = timetable.reduce((acc, entry) => {
      if (!acc[entry.dayOfWeek]) {
        acc[entry.dayOfWeek] = []
      }
      acc[entry.dayOfWeek].push({
        id: entry.id,
        subjectName: entry.subject.name,
        teacherName: entry.teacher.fullName,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
      })
      return acc
    }, {})

    return {
      status: 1,
      message: "Class timetable retrieved successfully",
      data: {
        class: {
          id: classEntity.id,
          name: `${classEntity.name} ${classEntity.section || ""}`.trim(),
        },
        timetable: weeklyTimetable,
      },
    }
  }

  async getTeacherTimetable(schoolId: number, teacherId: number) {
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId, schoolId },
    })

    if (!teacher) {
      throw new NotFoundException("Teacher not found")
    }

    const timetable = await this.timetableRepository.find({
      where: { teacherId, isActive: true },
      relations: ["class", "subject"],
      order: { dayOfWeek: "ASC", startTime: "ASC" },
    })

    // Group by day of week
    const weeklyTimetable = timetable.reduce((acc, entry) => {
      if (!acc[entry.dayOfWeek]) {
        acc[entry.dayOfWeek] = []
      }
      acc[entry.dayOfWeek].push({
        id: entry.id,
        className: `${entry.class.name} ${entry.class.section || ""}`.trim(),
        subjectName: entry.subject.name,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
      })
      return acc
    }, {})

    return {
      status: 1,
      message: "Teacher timetable retrieved successfully",
      data: {
        teacher: {
          id: teacher.id,
          name: teacher.fullName,
          department: teacher.department,
        },
        timetable: weeklyTimetable,
      },
    }
  }

  async createTimetableEntry(schoolId: number, createTimetableDto: CreateTimetableDto) {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } = createTimetableDto

    // Validate class, subject, and teacher exist
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, schoolId },
    })

    if (!classEntity) {
      throw new NotFoundException("Class not found")
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId, schoolId },
    })

    if (!subject) {
      throw new NotFoundException("Subject not found")
    }

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId, schoolId, roleId: 4 }, // Teacher role
    })

    if (!teacher) {
      throw new NotFoundException("Teacher not found")
    }

    // Check for conflicts
    const conflictingEntry = await this.timetableRepository.findOne({
      where: [
        {
          classId,
          dayOfWeek,
          startTime,
          isActive: true,
        },
        {
          teacherId,
          dayOfWeek,
          startTime,
          isActive: true,
        },
      ],
    })

    if (conflictingEntry) {
      throw new ConflictException("Time slot conflict detected")
    }

    const timetableEntry = this.timetableRepository.create({
      schoolId,
      classId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      room,
    })

    await this.timetableRepository.save(timetableEntry)

    return {
      status: 1,
      message: "Timetable entry created successfully",
      data: timetableEntry,
    }
  }

  async updateTimetableEntry(id: number, updateTimetableDto: UpdateTimetableDto) {
    const timetableEntry = await this.timetableRepository.findOne({
      where: { id },
    })

    if (!timetableEntry) {
      throw new NotFoundException("Timetable entry not found")
    }

    Object.assign(timetableEntry, updateTimetableDto)
    await this.timetableRepository.save(timetableEntry)

    return {
      status: 1,
      message: "Timetable entry updated successfully",
      data: timetableEntry,
    }
  }

  async deleteTimetableEntry(id: number) {
    const timetableEntry = await this.timetableRepository.findOne({
      where: { id },
    })

    if (!timetableEntry) {
      throw new NotFoundException("Timetable entry not found")
    }

    timetableEntry.isActive = false
    await this.timetableRepository.save(timetableEntry)

    return {
      status: 1,
      message: "Timetable entry deleted successfully",
    }
  }
}
