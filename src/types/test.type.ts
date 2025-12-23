import { QuestionLeanDocument } from 'src/database/models/question.schema';

export type Test = {
  title: string;
  description: string;
  questions: QuestionLeanDocument[];
  created_at: Date;
  created_by: string;
  status: string;
  timer: number;
};
