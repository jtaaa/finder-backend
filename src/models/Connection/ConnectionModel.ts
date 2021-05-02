import { ObjectId } from 'mongodb';
import { ObjectType, Field as GraphQLField } from 'type-graphql';
import { prop as DBProperty, getModelForClass } from '@typegoose/typegoose';
import { AuthenticationError } from 'apollo-server-errors';

import { DBSchema } from 'modules/Mongoose';
import { User } from 'models/User';
import { Visibility } from './enums';
import { ApproveConnectionReturn, Coordinate } from './types';
import { CoordinateInput } from './inputs';

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

  @GraphQLField((_type) => Coordinate, { nullable: true })
  @DBProperty()
  lastLocation?: Coordinate;

  // Private methods

  private ensureIsOwner(userId: ObjectId) {
    if (!this.owner.equals(userId)) {
      throw new AuthenticationError(
        'User does not own the specified connection.',
      );
    }
  }

  // Public methods

  async processLocation(userId: ObjectId, location: CoordinateInput) {
    this.ensureIsOwner(userId);
    if (!this.approved) return;
    if (this.visibility === Visibility.NotVisible) return;
    await ConnectionModel.findByIdAndUpdate(this._id, {
      lastLocation: location,
    });
  }

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
    return connection;
  }

  static async approveConnection(
    connectionId: ObjectId,
    userId: ObjectId,
  ): Promise<ApproveConnectionReturn> {
    const connection = await ConnectionModel.getFromUserInputId(connectionId);
    connection.ensureIsOwner(userId);

    connection.approved = true;
    await connection.save();

    const reverseConnection = await ConnectionModel.create({
      owner: connection.to,
      to: connection.owner,
      approved: true,
      visibility: Visibility.NotVisible,
    });

    return {
      connection: connection,
      reverseConnection: reverseConnection,
    };
  }

  static async getOwnedConnections(userId: ObjectId): Promise<Connection[]> {
    const connections = await ConnectionModel.find({ owner: userId });
    return connections;
  }
}

export const ConnectionModel = getModelForClass(Connection);
