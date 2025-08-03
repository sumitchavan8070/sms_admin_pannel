import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { SchoolsController } from "./schools.controller"
import { SchoolsService } from "./schools.service"
import { School } from "../../entities/school.entity"
import { SystemSetting } from "../../entities/system-setting.entity"

@Module({
  imports: [TypeOrmModule.forFeature([School, SystemSetting])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
