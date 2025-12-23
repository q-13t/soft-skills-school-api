import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { QuestionDto } from './question.dto';
import { QuestionType } from 'src/common/enums/question-type.enum';
import { CharacteristicWithSoftSkill } from 'src/types/question.type';

class CharacteristicDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        characteristicId: {
          example: '65b5c11125f8ef20c3de9ce3',
        },
        title: {
          example: 'Empathy',
        },
        points: {
          example: 5,
        },
        softSkill: {
          type: 'object',
          properties: {
            softSkillId: {
              example: '65b2d60d258c648f3e059867',
            },
            type: {
              example: 'Communication',
            },
          },
        },
        created_at: {
          example: '2024-01-28T02:50:57.981+00:00',
        },
      },
    },
  })
  characteristics: CharacteristicWithSoftSkill[];
}

export class CreateQuestionRequest extends OmitType(QuestionDto, [
  '_id',
  'created_at',
] as const) {}

export class CreateQuestionResponse extends OmitType(QuestionDto, [
  'characteristics',
] as const) {
  @ApiProperty({
    example: 'multiple_choice',
  })
  type: QuestionType;

  @ApiProperty({
    type: CharacteristicDto,
  })
  characteristics: CharacteristicDto[];
}

export class GetAllQuestionsResponse extends OmitType(QuestionDto, [
  'characteristics',
] as const) {
  @ApiProperty({
    type: CharacteristicDto,
  })
  characteristics: CharacteristicDto[];
}

export class GetQuestionResponse extends OmitType(QuestionDto, [
  'characteristics',
] as const) {
  @ApiProperty({
    type: CharacteristicDto,
  })
  characteristics: CharacteristicDto[];
}

export class DeleteQuestionResponse extends OmitType(QuestionDto, [
  'characteristics',
] as const) {
  @ApiProperty({
    type: CharacteristicDto,
  })
  characteristics: CharacteristicDto[];
}

export class UpdateQuestionRequest extends PickType(QuestionDto, [
  'question',
] as const) {
  @ApiProperty({
    example: 'Do you have good soft skills?',
    required: true,
  })
  question: string;
}

export class UpdateQuestionResponse extends OmitType(QuestionDto, [
  'characteristics' as const,
]) {
  @ApiProperty({
    example: 'Do you have good soft skills?',
    required: true,
  })
  question: string;

  @ApiProperty({
    type: CharacteristicDto,
  })
  characteristics: CharacteristicDto[];
}
