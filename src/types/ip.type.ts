import { Types } from 'mongoose';

export type Ip = {
  _id: Types.ObjectId;
  ip: string;
  requestCount: number;
  expiresAt: Date;
};
