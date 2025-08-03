import { Controller, Get, Post, Body, Query, UseGuards, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { FeesService } from "./fees.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { User } from "../../entities/user.entity"
import type { CreateFeePaymentDto } from "./dto/create-fee-payment.dto"

@ApiTags("Fees")
@Controller("fees")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get("categories")
  @ApiOperation({ summary: "Get all fee categories" })
  @ApiResponse({ status: 200, description: "Fee categories retrieved successfully" })
  async getFeeCategories(user: User) {
    return this.feesService.getFeeCategories(user.schoolId)
  }

  @Get("student/:studentId")
  @ApiOperation({ summary: "Get student fee details" })
  @ApiResponse({ status: 200, description: "Student fees retrieved successfully" })
  async getStudentFees(user: User, @Param('studentId') studentId: number) {
    return this.feesService.getStudentFees(user.schoolId, studentId)
  }

  @Get("pending")
  @ApiOperation({ summary: "Get pending fee payments" })
  @ApiResponse({ status: 200, description: "Pending fees retrieved successfully" })
  async getPendingFees(user: User) {
    return this.feesService.getPendingFees(user.schoolId)
  }

  @Post("payment")
  @ApiOperation({ summary: "Record fee payment" })
  @ApiResponse({ status: 201, description: "Payment recorded successfully" })
  async recordPayment(user: User, @Body() createFeePaymentDto: CreateFeePaymentDto) {
    return this.feesService.recordPayment(user, createFeePaymentDto)
  }

  @Get("reports/collection")
  @ApiOperation({ summary: "Get fee collection report" })
  async getFeeCollectionReport(user: User, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.feesService.getFeeCollectionReport(user.schoolId, startDate, endDate)
  }
}
