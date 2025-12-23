import {
  IsString,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  Min,
  Max,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OmitType, PickType } from '@nestjs/mapped-types';

@ValidatorConstraint({ name: 'isGender', async: false })
class IsGender implements ValidatorConstraintInterface {
  validate(value: string) {
    return value === 'Male' || value === 'Female';
  }

  defaultMessage(): string {
    return 'The gender must be either male or female';
  }
}

export class AuthDto {
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
  @Validate(IsGender)
  sex: string;

  @ApiProperty({
    example: 3,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(6)
  course: number;

  @ApiProperty({
    example: 'Design',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  direction: string;

  @ApiProperty({
    example: 'USER',
    required: true,
  })
  role: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  token: string;
}

export class SignUpDto extends OmitType(AuthDto, [
  'role',
  'token',
  'created_at',
] as const) {}

export class SignInDto extends PickType(AuthDto, [
  'email',
  'password',
] as const) {}
