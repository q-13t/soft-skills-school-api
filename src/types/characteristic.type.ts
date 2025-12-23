import { ObjectId } from 'mongoose';

export type Characteristic = {
  title: string;
  softSkill?: {
    softSkillId: ObjectId;
    type: string;
  };
  created_at: Date;
};
