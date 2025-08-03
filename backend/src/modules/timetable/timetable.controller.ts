import { Controller, Get, Post, Patch, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import  { TimetableService } from "./timetable.service"
import  { CreateTimetableDto } from "./dto/create-timetable.dto"
import  { UpdateTimetableDto } from "./dto/update-timetable.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import  { User } from "@/entities/user.entity"

@ApiTags("Timetable")
@Controller("timetable")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @ApiOperation({ summary: "Create timetable entry" })
  create(createTimetableDto: CreateTimetableDto, currentUser: User) {
    return this.timetableService.create(createTimetableDto, currentUser)
  }

  @Get()
  @ApiOperation({ summary: "Get timetable entries" })
  @ApiQuery({ name: "classId", required: false })
  @ApiQuery({ name: "teacherId", required: false })
  @ApiQuery({ name: "dayOfWeek", required: false })
  findAll(classId?: number, teacherId?: number, dayOfWeek?: string, currentUser?: User) {
    return this.timetableService.findAll({ classId, teacherId, dayOfWeek }, currentUser)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get timetable entry by ID" })
  findOne(id: string, currentUser: User) {
    return this.timetableService.findOne(+id, currentUser)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update timetable entry" })
  update(id: string, updateTimetableDto: UpdateTimetableDto, currentUser: User) {
    return this.timetableService.update(+id, updateTimetableDto, currentUser)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete timetable entry" })
  remove(id: string, currentUser: User) {
    return this.timetableService.remove(+id, currentUser)
  }

  @Get("class/:classId/weekly")
  @ApiOperation({ summary: "Get weekly timetable for class" })
  getWeeklyTimetable(classId: string, currentUser: User) {
    return this.timetableService.getWeeklyTimetable(+classId, currentUser)
  }

  @Get("teacher/:teacherId/schedule")
  @ApiOperation({ summary: "Get teacher schedule" })
  getTeacherSchedule(teacherId: string, currentUser: User) {
    return this.timetableService.getTeacherSchedule(+teacherId, currentUser)
  }
}
