import { OmitType } from '@nestjs/swagger';
import { TestDto } from './quiz.dto';

export class CreateTestRequest extends OmitType(TestDto, [
  '_id',
  'created_at',
] as const) {}

export class CreateTestResponse extends TestDto {}

export class GetTestResponse extends TestDto {}

export class GetAllTestsResponse extends TestDto {}

export class DeleteTestResponse extends TestDto {}
