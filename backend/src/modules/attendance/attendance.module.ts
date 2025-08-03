import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AttendanceController } from "./attendance.controller"
import { AttendanceService } from "./attendance.service"
import { StaffAttendance } from "@/entities/staff-attendance.entity"
import { StudentAttendance } from "@/entities/student-attendance.entity"
import { User } from "@/entities/user.entity"
import { Subject } from "@/entities/subject.entity"

@Module({
  imports: [TypeOrmModule.forFeature([StaffAttendance, StudentAttendance, User, Subject])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
