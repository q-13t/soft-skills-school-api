import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class TestDto {
  @ApiProperty({
    example: '659c6ea61266eb9da8f600fc',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  _id: ObjectId;

  @ApiProperty({
    example: 'Belbin test',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A test to determine your Belbin team roles',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: ['6589f4d63e0c5b3029146e70', '6595864ee4eccdb3a64c8072'],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  questions: Array<{ questionId: ObjectId }>;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  created_by: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ example: 120, required: false })
  @IsNotEmpty()
  timer: number;
}

export class CreateTestDto extends PickType(TestDto, [
  'title',
  'description',
  'questions',
  'created_by',
  'status',
  'timer',
] as const) {}
