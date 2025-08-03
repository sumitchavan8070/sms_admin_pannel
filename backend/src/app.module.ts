import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

// Modules
import { AuthModule } from "./modules/auth/auth.module"
import { SchoolsModule } from "./modules/schools/schools.module"
import { UsersModule } from "./modules/users/users.module"
import { AttendanceModule } from "./modules/attendance/attendance.module"
import { LeavesModule } from "./modules/leaves/leaves.module"
import { FeesModule } from "./modules/fees/fees.module"
import { ReportsModule } from "./modules/reports/reports.module"
import { NotificationsModule } from "./modules/notifications/notifications.module"
import { TimetableModule } from "./modules/timetable/timetable.module"
import { AssignmentsModule } from "./modules/assignments/assignments.module"

// Entities
import { School } from "./entities/school.entity"
import { Role } from "./entities/role.entity"
import { User } from "./entities/user.entity"
import { Class } from "./entities/class.entity"
import { Subject } from "./entities/subject.entity"
import { StaffAttendance } from "./entities/staff-attendance.entity"
import { StudentAttendance } from "./entities/student-attendance.entity"
import { LeaveType } from "./entities/leave-type.entity"
import { StaffLeaveApplication } from "./entities/staff-leave-application.entity"
import { StudentLeaveApplication } from "./entities/student-leave-application.entity"
import { FeeCategory } from "./entities/fee-category.entity"
import { StudentFee } from "./entities/student-fee.entity"
import { FeePayment } from "./entities/fee-payment.entity"
import { Salary } from "./entities/salary.entity"
import { Notification } from "./entities/notification.entity"
import { NotificationRecipient } from "./entities/notification-recipient.entity"
import { SystemSetting } from "./entities/system-setting.entity"
import { AuditLog } from "./entities/audit-log.entity"
import { Timetable } from "./entities/timetable.entity"
import { Assignment } from "./entities/assignment.entity"
import { AssignmentSubmission } from "./entities/assignment-submission.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 3306),
        username: configService.get("DB_USERNAME", "root"),
        password: configService.get("DB_PASSWORD", ""),
        database: configService.get("DB_DATABASE", "school_management_system"),
        entities: [
          School,
          Role,
          User,
          Class,
          Subject,
          StaffAttendance,
          StudentAttendance,
          LeaveType,
          StaffLeaveApplication,
          StudentLeaveApplication,
          FeeCategory,
          StudentFee,
          FeePayment,
          Salary,
          Notification,
          NotificationRecipient,
          SystemSetting,
          AuditLog,
          Timetable,
          Assignment,
          AssignmentSubmission,
        ],
        synchronize: false, // Set to false in production
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET", "sumit-chavan"),
        signOptions: { expiresIn: "24h" },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SchoolsModule,
    UsersModule,
    AttendanceModule,
    LeavesModule,
    FeesModule,
    ReportsModule,
    NotificationsModule,
    TimetableModule,
    AssignmentsModule,
    
  ],
})
export class AppModule {}
