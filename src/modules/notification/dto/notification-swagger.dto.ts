import { ApiProperty, PickType } from '@nestjs/swagger';
import { NotificationDto } from './notification.dto';

export class CreateNotificationRequest extends PickType(NotificationDto, [
  'studentIds',
  'meta',
  'title',
  'type',
] as const) {}

export class CreateNotificationResponse extends NotificationDto {}

export class GetNotificationResponse extends NotificationDto {}

export class DeleteNotificationResponse extends NotificationDto {}

export class GetAllNotificationsResponse extends NotificationDto {}

export class UpdateNotificationRequest extends PickType(NotificationDto, [
  'status',
] as const) {
  @ApiProperty({
    example: 'read',
  })
  status: string;
}

export class UpdateNotificationResponse extends NotificationDto {
  @ApiProperty({
    example: 'read',
  })
  status: string;
}
