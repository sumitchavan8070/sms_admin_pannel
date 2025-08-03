import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import type { NotificationsService } from "./notifications.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { User } from "../../entities/user.entity"
import type { CreateNotificationDto } from "./dto/create-notification.dto"

@ApiTags("Notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get user notifications" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  @ApiQuery({ name: "unreadOnly", required: false, description: "Show only unread notifications" })
  async getNotifications(
    user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return this.notificationsService.getUserNotifications(user.id, { page, limit, unreadOnly })
  }

  @Get("unread-count")
  @ApiOperation({ summary: "Get unread notifications count" })
  async getUnreadCount(user: User) {
    return this.notificationsService.getUnreadCount(user.id)
  }

  @Post()
  @ApiOperation({ summary: "Create notification" })
  @ApiResponse({ status: 201, description: "Notification created successfully" })
  async createNotification(user: User, @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(user, createNotificationDto)
  }

  @Put(":id/read")
  @ApiOperation({ summary: "Mark notification as read" })
  async markAsRead(user: User, @Param('id') id: number) {
    return this.notificationsService.markAsRead(user.id, id)
  }

  @Put("mark-all-read")
  @ApiOperation({ summary: "Mark all notifications as read" })
  async markAllAsRead(user: User) {
    return this.notificationsService.markAllAsRead(user.id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete notification" })
  async deleteNotification(user: User, @Param('id') id: number) {
    return this.notificationsService.deleteNotification(user.schoolId, id)
  }
}
