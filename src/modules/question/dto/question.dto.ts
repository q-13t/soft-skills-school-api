import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { QuestionType } from 'src/common/enums/question-type.enum';

export class QuestionDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty({
    example: 'What is active listening?',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    example: 'multiple_choice | yes_no | slider | radio',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(QuestionType)
  @IsString()
  type: QuestionType;

  @ApiProperty({
    example: [
      'Actively concentrating, understanding, and responding in a conversation',
      'Just hearing the words spoken without understanding the message',
      'Giving full attention, making eye contact, and providing feedback',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  answers?: string[];

  @ApiProperty({ example: [true, false, true] })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  correctAnswers?: boolean[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        characteristicId: {
          example: '65b5c11125f8ef20c3de9ce3',
        },
        points: {
          example: 5,
        },
      },
    },
  })
  @IsNotEmpty()
  @IsArray()
  characteristics: Array<{ characteristicId: ObjectId; points: number }>;

  @ApiProperty()
  created_at: Date;
}

export class CreateQuestionDto extends OmitType(QuestionDto, [
  '_id',
  'created_at',
] as const) {}

export class UpdateQuestionDto extends OmitType(QuestionDto, [
  '_id',
  'created_at',
] as const) {
  @IsOptional()
  question: string;

  @IsOptional()
  type: QuestionType;

  @IsOptional()
  points: number;
}
