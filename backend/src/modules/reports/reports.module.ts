import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ReportsController } from "./reports.controller"
import { ReportsService } from "./reports.service"
import { User } from "@/entities/user.entity"
import { StaffAttendance } from "@/entities/staff-attendance.entity"
import { StudentAttendance } from "@/entities/student-attendance.entity"
import { StudentFee } from "@/entities/student-fee.entity"
import { FeePayment } from "@/entities/fee-payment.entity"
import { Salary } from "@/entities/salary.entity"

@Module({
  imports: [TypeOrmModule.forFeature([User, StaffAttendance, StudentAttendance, StudentFee, FeePayment, Salary])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
