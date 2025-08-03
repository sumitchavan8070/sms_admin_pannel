import { Controller, Get, Post, Patch, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import  { NotificationsService } from "./notifications.service" 
import  { CreateNotificationDto } from "./dto/create-notification.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { GetUser } from "../auth/decorators/get-user.decorator"
import  { User } from "@/entities/user.entity"

@ApiTags("Notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: "Create notification" })
  create(createNotificationDto: CreateNotificationDto, @GetUser() user: User) {
    return this.notificationsService.create(createNotificationDto, user)
  }

  @Get()
  @ApiOperation({ summary: "Get notifications" })
  findAll(
    @Query('type') type?: string,
    @Query('priority') priority?: string,
    @Query('unreadOnly') unreadOnly?: boolean,
    @GetUser() user?: User,
  ) {
    return this.notificationsService.findAll({ type, priority, unreadOnly }, user)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get notification by ID" })
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.notificationsService.findOne(+id, user)
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Mark notification as read" })
  markAsRead(@Param('id') id: string, @GetUser() user: User) {
    return this.notificationsService.markAsRead(+id, user)
  }

  @Get('my/unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@GetUser() user: User) {
    return this.notificationsService.getUnreadCount(user);
  }
}
