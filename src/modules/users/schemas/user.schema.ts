import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty, IsOptional, Validate } from 'class-validator';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({ unique: true })
  @IsNotEmpty()
  username: string;

  @Prop({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({ length: 500 })
  @IsNotEmpty()
  profilePictureUrl: string;

  @Prop()
  @IsNotEmpty()
  encryptedPassword: string;

  @Prop()
  @IsNotEmpty()
  salt: string;

  @Prop()
  @IsNotEmpty()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
