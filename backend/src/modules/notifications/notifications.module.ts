import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { NotificationsController } from "./notifications.controller"
import { NotificationsService } from "./notifications.service" 
import { Notification } from "@/entities/notification.entity"
import { NotificationRecipient } from "@/entities/notification-recipient.entity"
import { User } from "@/entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationRecipient, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
