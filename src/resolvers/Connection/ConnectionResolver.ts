import { ObjectId } from 'mongodb';
import {
  Resolver,
  Ctx,
  Mutation,
  Arg,
  FieldResolver,
  Root,
} from 'type-graphql';

import { ApproveConnectionReturn, Connection } from 'models/Connection';
import { User, UserModel } from 'models/User';
import { ObjectIdScalar } from 'modules/Apollo/scalars/object-id.scalar';

@Resolver((_of) => Connection)
export class ConnectionResolver {
  @FieldResolver((_type) => User)
  async owner(@Root() connection: Connection): Promise<User> {
    return await UserModel.getFromUserInputId(connection.owner);
  }

  @FieldResolver((_type) => User)
  async to(@Root() connection: Connection): Promise<User> {
    return await UserModel.getFromUserInputId(connection.to);
  }

  @Mutation((_returns) => Connection)
  async requestConnection(
    @Ctx('user') user: User,
    @Arg('to', (_type) => ObjectIdScalar) to: ObjectId,
  ): Promise<Connection> {
    const connection = await Connection.requestConnection(user._id, to);
    return connection;
  }

  @Mutation((_returns) => ApproveConnectionReturn)
  async approveConnection(
    @Ctx('user') user: User,
    @Arg('connectionId') connectionId: ObjectId,
  ): Promise<ApproveConnectionReturn> {
    const connection = await Connection.approveConnection(
      connectionId,
      user._id,
    );
    return connection;
  }
}
