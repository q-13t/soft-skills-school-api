import { OmitType } from '@nestjs/swagger';
import { CharacteristicDto } from './characteristic.dto';

export class CreateCharacteristicRequest extends OmitType(CharacteristicDto, [
  '_id',
  'softSkill',
  'created_at',
] as const) {}

export class CreateCharacteristicResponse extends CharacteristicDto {}

export class GetAllCharacteristicsResponse extends CharacteristicDto {}

export class GetCharacteristicResponse extends CharacteristicDto {}

export class DeleteCharacteristicResponse extends CharacteristicDto {}
