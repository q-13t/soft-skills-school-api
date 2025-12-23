import { Types } from 'mongoose';

export type Feedback = {
  _id: Types.ObjectId;
  testId: Types.ObjectId;
  title: string;
  author: string;
  message: string;
  created_at: Date;
};
