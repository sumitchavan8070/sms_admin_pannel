import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TimetableController } from "./timetable.controller"
import { TimetableService } from "./timetable.service"
import { Timetable } from "../../entities/timetable.entity"
import { Class } from "../../entities/class.entity"
import { Subject } from "../../entities/subject.entity"
import { User } from "../../entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Timetable, Class, Subject, User])],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule {}
