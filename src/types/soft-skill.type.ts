import { ObjectId } from 'mongoose';

export type CharacteristicWithId = {
  characteristicId: ObjectId;
  title: string;
};

export type SoftSkill = {
  type: string;
  characteristics?: CharacteristicWithId[];
  description?: string;
  functionality?: string;
  created_at: Date;
};
