import { PickType } from '@nestjs/swagger';
import { SoftSkillDto } from './soft-skill.dto';

export class CreateSoftSkillRequest extends PickType(SoftSkillDto, [
  'type',
  'characteristics',
  'description',
  'functionality',
] as const) {}

export class CreateSoftSkillResponse extends SoftSkillDto {}

export class GetSoftSkillResponse extends SoftSkillDto {}

export class DeleteSoftSkillResponse extends SoftSkillDto {}

export class GetAllSoftSkillsResponse extends SoftSkillDto {}

export class UpdateSoftSkillRequest extends PickType(SoftSkillDto, [
  'type',
] as const) {}

export class UpdateSoftSkillResponse extends SoftSkillDto {}
