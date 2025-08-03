import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { School } from "./school.entity"

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  schoolId: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 20, nullable: true })
  code: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "int", default: 0 })
  credits: number

  @ManyToOne(() => School)
  @JoinColumn({ name: "schoolId" })
  school: School
}
