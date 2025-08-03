import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FeesController } from "./fees.controller"
import { FeesService } from "./fees.service"
import { StudentFee } from "@/entities/student-fee.entity"
import { FeePayment } from "@/entities/fee-payment.entity"
import { FeeCategory } from "@/entities/fee-category.entity"
import { User } from "@/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([StudentFee, FeePayment, FeeCategory, User])],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
