import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  IsOptional,
  IsArray,
  IsEnum,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { BelbinRole } from 'src/common/enums/belbin.enum';

export class UserDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Smith',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'johnsmith@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'qwerty123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Male|Female',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sex: string;

  @ApiProperty({
    example: 3,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  course: number;

  @ApiProperty({
    example: 'Design',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  direction: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  token: string;
}

export class UpdateUserDto extends OmitType(UserDto, [
  '_id',
  'created_at',
  'token',
] as const) {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  sex: string;

  @IsOptional()
  course: number;

  @IsOptional()
  direction: string;
}

export class AddResultsDto {
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsNotEmpty()
  @IsArray()
  answers: number[];

  @IsNotEmpty()
  @IsNumber()
  passageTime: number;
}

export class AddBelbinAnswerResultsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(BelbinRole)
  role: BelbinRole;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  value: number;
}

export class AddBelbinResultsDto {
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddBelbinAnswerResultsDto)
  answers: { role: BelbinRole; value: number }[];
}
