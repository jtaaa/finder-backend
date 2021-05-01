import { ObjectId } from 'mongodb';
import { ObjectType, Field as GraphQLField } from 'type-graphql';
import { prop as DBProperty, getModelForClass } from '@typegoose/typegoose';
import { AuthenticationError } from 'apollo-server-errors';

import { DBSchema } from 'modules/Mongoose';
import { User } from 'models/User';
import { Visibility } from './enums';
import { ApproveConnectionReturn } from './types';

@ObjectType()
export class Connection extends DBSchema {
  @GraphQLField()
  readonly _id!: ObjectId;

  @DBProperty({ ref: User, required: true })
  owner!: ObjectId;

  @DBProperty({ ref: User, required: true })
  to!: ObjectId;

  @GraphQLField()
  @DBProperty({ required: true })
  approved!: boolean;

  @GraphQLField((_type) => Visibility)
  @DBProperty({ enum: Visibility, required: true })
  visibility!: Visibility;

  // Static methods

  static async requestConnection(
    owner: ObjectId,
    to: ObjectId,
  ): Promise<Connection> {
    const connection = new ConnectionModel({
      owner,
      to,
      approved: false,
      visibility: Visibility.VisibleWhenMoving,
    });
    await connection.save();
    return connection.toObject();
  }

  static async approveConnection(
    connectionId: ObjectId,
    userId: ObjectId,
  ): Promise<ApproveConnectionReturn> {
    const connection = await ConnectionModel.getFromUserInputId(connectionId);
    if (!connection.to.equals(userId)) {
      throw new AuthenticationError(
        'User does not own the specified connection.',
      );
    }

    connection.approved = true;
    await connection.save();

    const reverseConnection = await ConnectionModel.create({
      owner: connection.to,
      to: connection.owner,
      approved: true,
      visibility: Visibility.NotVisible,
    });

    return {
      connection: connection.toObject(),
      reverseConnection: reverseConnection.toObject(),
    };
  }

  static async getOwnedConnections(userId: ObjectId): Promise<Connection[]> {
    const connections = await ConnectionModel.find({ owner: userId }).lean();
    return connections;
  }
}

export const ConnectionModel = getModelForClass(Connection);
