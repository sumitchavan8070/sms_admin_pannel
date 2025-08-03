import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LeavesController } from "./leaves.controller"
import { LeavesService } from "./leaves.service"
import { StaffLeaveApplication } from "@/entities/staff-leave-application.entity"
import { StudentLeaveApplication } from "@/entities/student-leave-application.entity"
import { LeaveType } from "@/entities/leave-type.entity"
import { User } from "@/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([StaffLeaveApplication, StudentLeaveApplication, LeaveType, User])],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [LeavesService],
})
export class LeavesModule {}
