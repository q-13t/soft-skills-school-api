import { ObjectId, Types } from 'mongoose';

export type CharacteristicWithSoftSkill = {
  characteristicId: Types.ObjectId;
  title: string;
  points: number;
  softSkill: {
    softSkillId: ObjectId;
    type: string;
  };
  created_at: Date;
};

export type Question = {
  question: string;
  type: string;
  answers?: string[];
  correctAnswers?: number[];
  characteristics: CharacteristicWithSoftSkill[];
  created_at: Date;
};
