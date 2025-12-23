import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IpDocument = HydratedDocument<Ip>;

@Schema()
export class Ip {
  @Prop({ required: true, unique: true })
  ip: string;

  @Prop({ default: 0 })
  requestCount: number;

  @Prop({ required: true })
  expiresAt: Date;
}

export const IpSchema = SchemaFactory.createForClass(Ip);

IpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
