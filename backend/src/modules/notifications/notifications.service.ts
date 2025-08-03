import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Notification, NotificationType, NotificationPriority } from "../../entities/notification.entity"
import { NotificationRecipient } from "../../entities/notification-recipient.entity"
import { User } from "../../entities/user.entity"
import { RoleName } from "../../entities/role.entity"
import type { CreateNotificationDto } from "./dto/create-notification.dto"

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationRecipient)
    private notificationRecipientRepository: Repository<NotificationRecipient>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, currentUser: User) {
    const { recipientIds, ...notificationData } = createNotificationDto

    // Create notification
    const notification = this.notificationRepository.create({
      ...notificationData,

      // createdBy: currentUser.id,
    })

    const savedNotification = await this.notificationRepository.save(notification)

    // Create notification recipients
    if (recipientIds && recipientIds.length > 0) {
      const recipients = recipientIds.map((recipientId) =>
        this.notificationRecipientRepository.create({
          notificationId: savedNotification.id,
          recipientId,
          isRead: false,
        }),
      )
      await this.notificationRecipientRepository.save(recipients)
    }

    return savedNotification
  }

  async findAll(filters: any, currentUser: User) {
    const { type, priority, unreadOnly } = filters

    const queryBuilder = this.notificationRecipientRepository
      .createQueryBuilder("recipient")
      .leftJoinAndSelect("recipient.notification", "notification")
      .leftJoinAndSelect("notification.createdByUser", "createdBy")
      .where("recipient.recipientId = :userId", { userId: currentUser.id })

    if (type) {
      queryBuilder.andWhere("notification.type = :type", { type })
    }

    if (priority) {
      queryBuilder.andWhere("notification.priority = :priority", { priority })
    }

    if (unreadOnly) {
      queryBuilder.andWhere("recipient.isRead = :isRead", { isRead: false })
    }

    queryBuilder.orderBy("notification.createdAt", "DESC")

    return queryBuilder.getMany()
  }

  async findOne(id: number, currentUser: User) {
    const recipient = await this.notificationRecipientRepository.findOne({
      where: {
        notificationId: id,
        recipientId: currentUser.id,
      },
      relations: ["notification", "notification.createdByUser"],
    })

    if (!recipient) {
      throw new NotFoundException("Notification not found")
    }

    return recipient
  }

  async markAsRead(id: number, currentUser: User) {
    const recipient = await this.notificationRecipientRepository.findOne({
      where: {
        notificationId: id,
        recipientId: currentUser.id,
      },
    })

    if (!recipient) {
      throw new NotFoundException("Notification not found")
    }

    recipient.isRead = true
    recipient.readAt = new Date()

    await this.notificationRecipientRepository.save(recipient)

    return { message: "Notification marked as read" }
  }

  async getUnreadCount(currentUser: User) {
    const count = await this.notificationRecipientRepository.count({
      where: {
        recipientId: currentUser.id,
        isRead: false,
      },
    })

    return { unreadCount: count }
  }

  async sendBulkNotification(
    title: string,
    message: string,
    type: NotificationType,
    priority: NotificationPriority,
    recipientRole: RoleName,
    schoolId?: number,
    currentUser?: User,
  ) {
    // Get recipients based on role and school
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: recipientRole })

    if (schoolId) {
      queryBuilder.andWhere("user.schoolId = :schoolId", { schoolId })
    }

    const recipients = await queryBuilder.getMany()

    if (recipients.length === 0) {
      return { message: "No recipients found" }
    }

    // // Create notification
    // const notification = this.notificationRepository.create({
    //   title,
    //   message,
    //   type,
    //   priority,
    //   createdBy: currentUser?.id,
    // })

    // const savedNotification = await this.notificationRepository.save(notification)

    // Create notification recipients
    const notificationRecipients = recipients.map((recipient) =>
      this.notificationRecipientRepository.create({
        notificationId: 123456,
        recipientId: recipient.id,
        isRead: false,
      }),
    )

    await this.notificationRecipientRepository.save(notificationRecipients)

    return {
      message: `Notification sent to ${recipients.length} recipients`,
      recipientCount: recipients.length,
    }
  }
}
