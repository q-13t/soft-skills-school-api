import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { Notification } from 'src/types/notification.type';
import { NotificationService } from './notification.service';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
  DeleteNotificationResponse,
  GetAllNotificationsResponse,
  GetNotificationResponse,
  UpdateNotificationRequest,
  UpdateNotificationResponse,
} from './dto/notification-swagger.dto';
import { Observable } from 'rxjs';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Add notification' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateNotificationRequest,
    description: 'JSON structure for notification',
  })
  @ApiResponse({
    type: CreateNotificationResponse,
    status: 200,
    description: 'The notification has been successfully created',
  })
  async create(
    @User() user: any,
    @Body() body: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationService.create(user.sub, body);

    return notification;
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Stream notifications via SSE' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Real-time notification stream',
  })
  streamNotifications(): Observable<any> {
    return this.notificationService.streamNotifications();
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiBearerAuth()
  @ApiResponse({
    type: [GetAllNotificationsResponse],
    status: 200,
    description: 'The notifications successfully retrieve from database',
  })
  async getAll(): Promise<Notification[]> {
    const fetchedNotifications = await this.notificationService.getAll();

    return fetchedNotifications;
  }

  @Get('/user-notifications')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all users notifications' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    description: 'Number of notifications per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'pageNumber',
    type: Number,
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @ApiResponse({
    type: [GetAllNotificationsResponse],
    status: 200,
    description: 'The users notifications successfully retrieve from database',
  })
  async getAllUsersNotifications(
    @User() user: any,
    @Query('pageSize') pageSize = 10,
    @Query('pageNumber') pageNumber = 1,
  ): Promise<Notification[]> {
    const fetchedNotifications =
      await this.notificationService.getAllUsersNotifications(
        user.sub,
        Number(pageSize),
        Number(pageNumber),
      );

    return fetchedNotifications;
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get notification' })
  @ApiBearerAuth()
  @ApiResponse({
    type: GetNotificationResponse,
    status: 200,
    description: 'The notification successfully retrieve from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  async get(@Param() id: findByIdDto): Promise<Notification> {
    const fetchedNotification = await this.notificationService.get(id);

    return fetchedNotification;
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiBearerAuth()
  @ApiResponse({
    type: DeleteNotificationResponse,
    status: 200,
    description: 'The notification successfully deleted from database',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  async delete(@Param() id: deleteByIdDto): Promise<Notification> {
    const deletedNotification = await this.notificationService.delete(id);

    return deletedNotification;
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update notification' })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateNotificationRequest,
    description: 'JSON structure for notification',
  })
  @ApiResponse({
    type: UpdateNotificationResponse,
    status: 200,
    description: 'The notification successfully updated',
  })
  async update(
    @Param() id: findByIdDto,
    @Body() body: UpdateNotificationDto,
  ): Promise<Notification> {
    const updatedNotification = await this.notificationService.update(id, body);

    return updatedNotification;
  }
}
