import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CharacteristicDto {
  @ApiProperty({
    example: '659c6ea61266eb9da8f600fc',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  _id: ObjectId;

  @ApiProperty({
    example: 'Empathy',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: 'object',
    properties: {
      softSkillId: {
        example: '507f1f77bcf86cd799439011',
      },
      type: {
        example: 'Communication',
      },
    },
    required: true,
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  softSkill: {
    softSkillId: ObjectId;
    type: string;
  };

  @ApiProperty()
  created_at: Date;
}

export class CreateCharacteristicDto extends OmitType(CharacteristicDto, [
  '_id',
  'softSkill',
  'created_at',
] as const) {}
