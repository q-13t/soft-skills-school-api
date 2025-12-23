import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  sex: string;

  @Prop()
  course: number;

  @Prop()
  direction: string;

  @Prop()
  role: Role;

  @Prop()
  token: string;

  @Prop()
  tests: Record<string, any>[];

  @Prop()
  notifications: Notification[];

  @Prop()
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
