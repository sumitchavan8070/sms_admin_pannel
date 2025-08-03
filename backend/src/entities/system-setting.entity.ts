import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("system_settings")
export class SystemSetting {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100, unique: true })
  key: string

  @Column({ type: "text" })
  value: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
