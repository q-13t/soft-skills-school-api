import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CharacteristicWithId } from 'src/types/soft-skill.type';

export type SoftSkillDocument = HydratedDocument<SoftSkill>;

@Schema({ collection: 'soft_skills' })
export class SoftSkill {
  @Prop()
  type: string;

  @Prop()
  characteristics?: CharacteristicWithId[];

  @Prop()
  description?: string;

  @Prop()
  functionality?: string;

  @Prop()
  created_at: Date;
}

export const SoftSkillSchema = SchemaFactory.createForClass(SoftSkill);
