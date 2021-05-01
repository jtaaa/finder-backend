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
  @DBProperty({ required: true, trim: true, unique: true, index: true })
  userName!: string;

  @GraphQLField()
  @DBProperty({ required: true, trim: true })
  phoneNumber!: string;

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

  static async search(query: string) {
    const USERNAME_SEARCH_RESULTS_LIMIT = 10;

    const usernameResults = await UserModel.find({
      userName: new RegExp(`${query}.*`),
    }).limit(USERNAME_SEARCH_RESULTS_LIMIT);

    return usernameResults;
  }
}

export const UserModel = getModelForClass(User);
