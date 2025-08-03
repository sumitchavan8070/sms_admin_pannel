import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateFeePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  studentFeeId: number

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @ApiProperty({ example: "cash", enum: ["cash", "card", "bank_transfer", "online", "cheque"] })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string

  @ApiProperty({ example: "TXN123456", required: false })
  @IsString()
  @IsOptional()
  transactionId?: string

  @ApiProperty({ example: "Payment for tuition fee", required: false })
  @IsString()
  @IsOptional()
  notes?: string
}
