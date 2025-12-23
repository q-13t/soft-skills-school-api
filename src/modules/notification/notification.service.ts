import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { Notification } from 'src/types/notification.type';
import { InjectModel } from '@nestjs/mongoose';
import { Notification as NotificationDB } from 'src/database/models/notification.schema';
import { Model, Types } from 'mongoose';
import { User as UserDB } from 'src/database/models/user.schema';
import { LoggerService } from 'src/common/helpers/winston.logger';
import { findByIdDto } from 'src/common/dto/findById.dto';
import { deleteByIdDto } from 'src/common/dto/deleteById.dto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationService {
  private notificationSubject = new Subject<Notification>();

  constructor(
    @InjectModel(NotificationDB.name)
    private readonly notificationModel: Model<NotificationDB>,
    @InjectModel(UserDB.name)
    private readonly userModel: Model<UserDB>,
    private readonly logger: LoggerService,
  ) {}

  async create(
    ownerId: string,
    body: CreateNotificationDto,
  ): Promise<Notification> {
    const { studentIds } = body;

    for (const studentId of studentIds) {
      await this.checkStudentExists(studentId);
    }

    const notification = new this.notificationModel({
      ...body,
      ownerId,
      status: 'unread',
      created_at: new Date(),
      updated_at: null,
    });

    const savedNotification = await notification.save();

    for (const studentId of studentIds) {
      await this.addNotificationToUser(studentId, savedNotification);
    }

    this.notificationSubject.next(savedNotification);

    return savedNotification;
  }

  async checkStudentExists(id: string): Promise<void> {
    const fetchedUser = await this.userModel.findById(new Types.ObjectId(id));

    if (!fetchedUser) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
  }

  async addNotificationToUser(
    studentId: string,
    notification: Notification,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(studentId),
      {
        $push: {
          notifications: {
            $each: [notification],
            $position: 0,
          },
        },
      },
      { new: true },
    );
  }

  async getAll(): Promise<Notification[]> {
    const fetchedNotifications = await this.notificationModel.find({});

    if (fetchedNotifications.length === 0) {
      this.logger.error('Items not found');
      throw new HttpException('Items not found', HttpStatus.NOT_FOUND);
    }

    return fetchedNotifications;
  }

  async getAllUsersNotifications(
    userId: string,
    pageSize: number,
    pageNumber: number,
  ): Promise<Notification[]> {
    const skip = (pageNumber - 1) * pageSize;

    const limit = pageSize;

    const fetchedUser: any = await this.userModel
      .findById(userId)
      .select({ notifications: { $slice: [skip, limit] } });

    if (!fetchedUser) {
      this.logger.error('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return fetchedUser.notifications;
  }

  async get(notificationId: findByIdDto): Promise<Notification> {
    const { id } = notificationId;

    const fetchedNotification = await this.notificationModel.findById(id);

    if (!fetchedNotification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    return fetchedNotification;
  }

  async delete(notificationId: deleteByIdDto): Promise<Notification> {
    const { id } = notificationId;

    const deletedNotification = await this.notificationModel.findByIdAndDelete(
      id,
    );

    if (!deletedNotification) {
      this.logger.error('Notification not found');
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    return deletedNotification;
  }

  async update(
    notificationId: findByIdDto,
    body: UpdateNotificationDto,
  ): Promise<Notification> {
    const { id } = notificationId;

    const updatedNotification = await this.notificationModel.findByIdAndUpdate(
      id,
      body,
      { new: true },
    );

    if (!updatedNotification) {
      this.logger.error('Notification not found');
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    return updatedNotification;
  }

  streamNotifications(): Observable<any> {
    return new Observable((observer) => {
      const subscription = this.notificationSubject.subscribe(
        (notification) => {
          observer.next({
            data: notification,
            id: notification._id.toString(),
            event: 'notification',
          });
        },
      );

      return () => subscription.unsubscribe();
    });
  }
}
