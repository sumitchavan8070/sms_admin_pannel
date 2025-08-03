import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { StudentFee } from "./student-fee.entity"
import { User } from "./user.entity"

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  ONLINE = "online",
  CHEQUE = "cheque",
}

@Entity("fee_payments")
export class FeePayment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  studentFeeId: number

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ type: "enum", enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @Column({ length: 100, nullable: true })
  transactionId: string

  @Column({ length: 100, unique: true })
  receiptNumber: string

  @Column({ nullable: true })
  receivedBy: number

  @Column({ type: "text", nullable: true })
  notes: string

  @CreateDateColumn()
  paymentDate: Date

  @ManyToOne(
    () => StudentFee,
    (fee) => fee.payments,
  )
  @JoinColumn({ name: "studentFeeId" })
  studentFee: StudentFee

  @ManyToOne(() => User)
  @JoinColumn({ name: "receivedBy" })
  receivedByUser: User
}
