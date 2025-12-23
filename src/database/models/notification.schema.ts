import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ type: Types.ObjectId })
  studentIds: ObjectId[];

  @Prop({ type: Types.ObjectId })
  ownerId: ObjectId;

  @Prop()
  title: string;

  @Prop({ type: Object })
  meta: Record<string, any>;

  @Prop()
  type: string;

  @Prop()
  status: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
