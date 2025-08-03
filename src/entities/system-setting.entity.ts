import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { School } from "./school.entity"

@Entity("system_settings")
export class SystemSetting {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column({ length: 100 })
  key: string

  @Column({ type: "text" })
  value: string

  @Column({ type: "text", nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School
}
