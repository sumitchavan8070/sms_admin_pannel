import { Controller, Get, Post, Query, UseGuards, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import  { CreateFeePaymentDto } from "./dto/create-fee-payment.dto"
import  { FeesService } from "./fees.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { GetUser } from "../auth/decorators/get-user.decorator"
import  { User } from "@/entities/user.entity"

@ApiTags("Fees")
@Controller("fees")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post("payment")
  @ApiOperation({ summary: "Create fee payment" })
  createPayment(createFeePaymentDto: CreateFeePaymentDto, @GetUser() currentUser: User) {
    return this.feesService.createPayment(createFeePaymentDto, currentUser)
  }

  @Get("student/:studentId")
  @ApiOperation({ summary: "Get student fees" })
  getStudentFees(@Param('studentId') studentId: string, @GetUser() currentUser: User) {
    return this.feesService.getStudentFees(+studentId, currentUser)
  }

  @Get("payments")
  @ApiOperation({ summary: "Get fee payments" })
  @ApiQuery({ name: "studentId", required: false })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  getPayments(
    @Query('studentId') studentId?: number,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const currentUser = this.getCurrentUser() // Assuming getCurrentUser method is implemented
    return this.feesService.getPayments({ studentId, status, startDate, endDate }, currentUser)
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get fee categories' })
  getFeeCategories(@GetUser() currentUser: User) {
    return this.feesService.getFeeCategories(currentUser)
  }

  @Get('outstanding')
  @ApiOperation({ summary: 'Get outstanding fees' })
  getOutstandingFees(@GetUser() currentUser: User) {
    return this.feesService.getOutstandingFees(currentUser)
  }

  private getCurrentUser(): User {
    // Implementation to get current user
    return {} as User // Placeholder implementation
  }
}
