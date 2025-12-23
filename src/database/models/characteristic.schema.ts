import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type CharacteristicDocument = HydratedDocument<Characteristic>;

@Schema()
export class Characteristic {
  @Prop()
  title: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'softSkill' })
  softSkill?: {
    softSkillId: ObjectId;
    type: string;
  };

  @Prop()
  created_at: Date;
}

export const CharacteristicSchema =
  SchemaFactory.createForClass(Characteristic);
