import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FeesController } from "./fees.controller"
import { FeesService } from "./fees.service"
import { FeeCategory } from "../../entities/fee-category.entity"
import { StudentFee } from "../../entities/student-fee.entity"
import { FeePayment } from "../../entities/fee-payment.entity"
import { User } from "../../entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([FeeCategory, StudentFee, FeePayment, User])],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
