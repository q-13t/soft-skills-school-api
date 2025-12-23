import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BelbinRole } from 'src/common/enums/belbin.enum';
import { CharacteristicWithSoftSkill } from 'src/types/question.type';

export type QuestionDocument = HydratedDocument<Question>;
export type QuestionLeanDocument = Question & { _id: Types.ObjectId };

@Schema()
export class Question {
  @Prop()
  question: string;

  @Prop()
  type: string;

  @Prop()
  answers: string[];

  @Prop()
  correctAnswers: number[];

  @Prop({ type: Array<any> })
  characteristics: CharacteristicWithSoftSkill[];

  @Prop()
  created_at: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class BelbinQuestion {
  @Prop()
  question: string;

  @Prop()
  type: 'belbin';

  @Prop({ type: Array<any> })
  subQuestions: { role: BelbinRole; question: string }[];

  @Prop()
  created_at: Date;
}

export type BelbinQuestionDocument = HydratedDocument<BelbinQuestion>;
export type BelbinQuestionLeanDocument = BelbinQuestion & {
  _id: Types.ObjectId;
};

export const BelbinQuestionSchema =
  SchemaFactory.createForClass(BelbinQuestion);
