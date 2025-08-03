import { PartialType } from "@nestjs/swagger"
import { CreateTimetableDto } from "./create-timetable.dto"
import { IsOptional, IsBoolean } from "class-validator"

export class UpdateTimetableDto extends PartialType(CreateTimetableDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
