import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema()
export class Feedback {
  @Prop()
  testId: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  message: string;

  @Prop()
  created_at: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
