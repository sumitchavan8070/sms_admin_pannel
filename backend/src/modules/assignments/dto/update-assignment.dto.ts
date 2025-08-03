import { PartialType } from "@nestjs/swagger"
import { CreateAssignmentDto } from "./create-assignment.dto"
import { IsOptional, IsEnum } from "class-validator"
import { AssignmentStatus } from "@/entities/assignment.entity"

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus
}
