import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from 'src/database/models/notification.schema';
import { NotificationService } from './notification.service';
import { User, UserSchema } from 'src/database/models/user.schema';
import { LoggerService } from 'src/common/helpers/winston.logger';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, LoggerService],
})
export class NotificationModule {}
