import { ObjectId } from 'mongodb';
import { ObjectType, Field as GraphQLField } from 'type-graphql';
import { UserInputError } from 'apollo-server-errors';
import { prop as DBProperty, getModelForClass } from '@typegoose/typegoose';

import { NewUserInput } from './inputs';

@ObjectType()
export class User {
  @GraphQLField()
  readonly _id!: ObjectId;

  @GraphQLField()
  @DBProperty({ required: true, trim: true, unique: true, index: true })
  email!: string;

  @GraphQLField()
  @DBProperty({ required: true, trim: true })
  firstName!: string;

  @GraphQLField()
  @DBProperty({ required: true, trim: true })
  lastName!: string;

  @DBProperty({ unique: true, sparse: true, index: true })
  googleId?: string;

  @DBProperty({ unique: true, sparse: true, index: true })
  facebookId?: string;

  // Static methods

  static async signUp(userInput: NewUserInput) {
    if (
      userInput.facebookId === undefined &&
      userInput.googleId === undefined
    ) {
      throw new UserInputError(
        'A googleId or facebookId is required create a new user.',
      );
    }

    const user = await UserModel.create(userInput);
    return user;
  }
}

export const UserModel = getModelForClass(User);
