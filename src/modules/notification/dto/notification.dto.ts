import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class NotificationDto {
  @ApiProperty({
    example: '659c6ea61266eb9da8f600fc',
    required: true,
  })
  _id: ObjectId;

  @ApiProperty({
    example: '67320ad23190251b64bf2608',
    required: true,
  })
  @IsNotEmpty()
  @IsOptional()
  testId: ObjectId;

  @ApiProperty({
    example: '67320ad23190251b64bf2608',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  studentIds: string[];

  @ApiProperty({
    example: '67391c0c3190251b64bf2633',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @ApiProperty({
    example: 'Invitation to event',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Event',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    example: 'Hello, event will be at 6PM',
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
  meta: Record<string, string>;

  @ApiProperty({
    example: 'Unread',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class CreateNotificationDto extends OmitType(NotificationDto, [
  '_id',
  'ownerId',
  'status',
  'created_at',
  'updated_at',
] as const) {}

export class UpdateNotificationDto extends OmitType(NotificationDto, [
  '_id',
  'created_at',
  'updated_at',
  'ownerId',
  'studentIds',
] as const) {
  @IsOptional()
  title: string;

  @IsOptional()
  type: string;

  @IsOptional()
  status: string;

  @IsOptional()
  meta: Record<string, string>;
}
