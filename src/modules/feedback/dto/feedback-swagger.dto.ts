import { ApiProperty, PickType } from '@nestjs/swagger';
import { FeedbackDto } from './feedback.dto';

export class CreateFeedbackRequest extends PickType(FeedbackDto, [
  'testId',
  'title',
  'author',
  'message',
] as const) {}

export class CreateFeedbackResponse extends FeedbackDto {}

export class GetFeedbackResponse extends FeedbackDto {}

export class DeleteFeedbackResponse extends FeedbackDto {}

export class GetAllFeedbacksResponse extends FeedbackDto {}

export class UpdateFeedbackRequest extends PickType(FeedbackDto, [
  'title',
  'author',
  'message',
] as const) {
  @ApiProperty({
    example: 'Good results',
  })
  title: string;

  @ApiProperty({
    example: 'Stepan Vasilevich',
  })
  author: string;

  @ApiProperty({
    example: 'Good results',
  })
  message: string;
}

export class UpdateFeedbackResponse extends FeedbackDto {
  @ApiProperty({
    example: 'Good results',
  })
  title: string;

  @ApiProperty({
    example: 'Stepan Vasilevich',
  })
  author: string;

  @ApiProperty({
    example: 'Good results',
  })
  message: string;
}
