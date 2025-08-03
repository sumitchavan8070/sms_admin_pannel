import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { PaymentMethod } from "@/entities/fee-payment.entity"

export class CreateFeePaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  studentFeeId: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string
}
