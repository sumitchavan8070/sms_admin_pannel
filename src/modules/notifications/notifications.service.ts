import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Notification } from "../../entities/notification.entity"
import type { NotificationRecipient } from "../../entities/notification-recipient.entity"
import type { User } from "../../entities/user.entity"
import type { CreateNotificationDto } from "./dto/create-notification.dto"

interface GetNotificationsOptions {
  page?: number
  limit?: number
  unreadOnly?: boolean
}

@Injectable()
export class NotificationsService {
  private notificationRepository: Repository<Notification>
  private recipientRepository: Repository<NotificationRecipient>
  private userRepository: Repository<User>

  constructor(
    notificationRepository: Repository<Notification>,
    recipientRepository: Repository<NotificationRecipient>,
    userRepository: Repository<User>,
  ) {
    this.notificationRepository = notificationRepository
    this.recipientRepository = recipientRepository
    this.userRepository = userRepository
  }

  async getUserNotifications(userId: number, options: GetNotificationsOptions) {
    const { page = 1, limit = 20, unreadOnly = false } = options

    const queryBuilder = this.recipientRepository
      .createQueryBuilder("recipient")
      .leftJoinAndSelect("recipient.notification", "notification")
      .where("recipient.userId = :userId", { userId })

    if (unreadOnly) {
      queryBuilder.andWhere("recipient.isRead = false")
    }

    const [recipients, total] = await queryBuilder
      .orderBy("notification.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    const notifications = recipients.map((recipient) => ({
      id: recipient.notification.id,
      title: recipient.notification.title,
      message: recipient.notification.message,
      type: recipient.notification.type,
      priority: recipient.notification.priority,
      isRead: recipient.isRead,
      readAt: recipient.readAt,
      createdAt: recipient.notification.createdAt,
    }))

    return {
      status: 1,
      message: "Notifications retrieved successfully",
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  }

  async getUnreadCount(userId: number) {
    const count = await this.recipientRepository.count({
      where: { userId, isRead: false },
    })

    return {
      status: 1,
      message: "Unread count retrieved successfully",
      data: { count },
    }
  }

  async createNotification(user: User, createNotificationDto: CreateNotificationDto) {
    const { title, message, type, priority, targetRoles, targetUsers } = createNotificationDto

    // Create notification
    const notification = this.notificationRepository.create({
      schoolId: user.schoolId,
      title,
      message,
      type,
      priority,
      targetRoles,
      targetUsers,
      createdBy: user.id,
    })

    await this.notificationRepository.save(notification)

    // Determine recipients
    let recipients: User[] = []

    if (targetUsers && targetUsers.length > 0) {
      // Specific users
      recipients = await this.userRepository.find({
        where: { id: targetUsers as any, schoolId: user.schoolId },
      })
    } else if (targetRoles && targetRoles.length > 0) {
      // Users by roles
      recipients = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.role", "role")
        .where("user.schoolId = :schoolId", { schoolId: user.schoolId })
        .andWhere("role.name IN (:...roles)", { roles: targetRoles })
        .getMany()
    } else {
      // All users in school
      recipients = await this.userRepository.find({
        where: { schoolId: user.schoolId },
      })
    }

    // Create recipient records
    const recipientRecords = recipients.map((recipient) =>
      this.recipientRepository.create({
        notificationId: notification.id,
        userId: recipient.id,
      }),
    )

    await this.recipientRepository.save(recipientRecords)

    return {
      status: 1,
      message: "Notification created successfully",
      data: {
        notification,
        recipientCount: recipients.length,
      },
    }
  }

  async markAsRead(userId: number, notificationId: number) {
    const recipient = await this.recipientRepository.findOne({
      where: { userId, notificationId },
    })

    if (!recipient) {
      throw new NotFoundException("Notification not found")
    }

    recipient.isRead = true
    recipient.readAt = new Date()
    await this.recipientRepository.save(recipient)

    return {
      status: 1,
      message: "Notification marked as read",
    }
  }

  async markAllAsRead(userId: number) {
    await this.recipientRepository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() })

    return {
      status: 1,
      message: "All notifications marked as read",
    }
  }

  async deleteNotification(schoolId: number, notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, schoolId },
    })

    if (!notification) {
      throw new NotFoundException("Notification not found")
    }

    // Delete recipients first
    await this.recipientRepository.delete({ notificationId })

    // Delete notification
    await this.notificationRepository.delete(notificationId)

    return {
      status: 1,
      message: "Notification deleted successfully",
    }
  }
}
