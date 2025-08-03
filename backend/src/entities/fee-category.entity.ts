import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { School } from "./school.entity"

@Entity("fee_categories")
export class FeeCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => School,
    (school) => school.id,
  )
  @JoinColumn({ name: "schoolId" })
  school: School

  @Column()
  schoolId: number
}
