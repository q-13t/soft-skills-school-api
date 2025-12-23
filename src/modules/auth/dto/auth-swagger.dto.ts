import { AuthDto } from './auth.dto';
import { OmitType, PickType } from '@nestjs/swagger';

export class SignUpRequest extends OmitType(AuthDto, [
  'role',
  'token',
  'created_at',
] as const) {}

export class SignUpResponse extends OmitType(AuthDto, ['token'] as const) {}

export class SignInRequest extends PickType(AuthDto, [
  'email',
  'password',
] as const) {}
