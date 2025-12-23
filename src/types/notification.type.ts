import { ObjectId, Types } from 'mongoose';

export type Notification = {
  _id: Types.ObjectId;
  studentIds: ObjectId[];
  ownerId: ObjectId;
  title: string;
  meta: Record<string, string>;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};
