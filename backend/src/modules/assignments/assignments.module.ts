import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AssignmentsController } from "./assignments.controller"
import { AssignmentsService } from "./assignments.service"
import { Assignment } from "@/entities/assignment.entity"
import { AssignmentSubmission } from "@/entities/assignment-submission.entity"
import { Subject } from "@/entities/subject.entity"
import { Class } from "@/entities/class.entity"
import { User } from "@/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, AssignmentSubmission, Subject, Class, User])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
