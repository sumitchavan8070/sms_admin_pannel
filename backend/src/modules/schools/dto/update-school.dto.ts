import { PartialType } from "@nestjs/swagger"
import { CreateSchoolDto } from "./create-school.dto"
import { IsOptional, IsBoolean } from "class-validator"

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
