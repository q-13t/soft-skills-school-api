import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class FeedbackDto {
  @ApiProperty({
    example: '659c6ea61266eb9da8f600fc',
    required: true,
  })
  _id: ObjectId;

  @ApiProperty({
    example: '65b5c11125f8ef20c3de9ce3',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({
    example: 'What a great test!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Tamara Petrovna',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 'Great results! I really enjoyed it!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  created_at: Date;
}

export class CreateFeedbackDto extends OmitType(FeedbackDto, [
  '_id',
  'created_at',
]) {}

export class UpdateFeedbackDto extends OmitType(FeedbackDto, [
  '_id',
  'testId',
  'created_at',
]) {
  @IsOptional()
  title: string;

  @IsOptional()
  author: string;

  @IsOptional()
  message: string;
}
