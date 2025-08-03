import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LeavesController } from "./leaves.controller"
import { LeavesService } from "./leaves.service"
import { LeaveType } from "../../entities/leave-type.entity"
import { StaffLeaveApplication } from "../../entities/staff-leave-application.entity"
import { StudentLeaveApplication } from "../../entities/student-leave-application.entity"
import { User } from "../../entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType, StaffLeaveApplication, StudentLeaveApplication, User])],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [LeavesService],
})
export class LeavesModule {}
