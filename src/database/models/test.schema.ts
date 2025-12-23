import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Question, QuestionLeanDocument } from './question.schema';

export type TestDocument = HydratedDocument<Test>;

@Schema()
export class Test {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  questions: QuestionLeanDocument[];

  @Prop()
  created_at: Date;

  @Prop()
  created_by: string;

  @Prop()
  status: string;

  @Prop()
  timer: number;
}

export const TestSchema = SchemaFactory.createForClass(Test);
