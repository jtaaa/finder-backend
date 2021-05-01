import { ObjectId } from 'mongodb';
import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql';

import { AuthenticationContext } from 'modules/Passport';
import { Context } from 'modules/Apollo';
import { User } from 'models/User';
import { ApproveConnectionReturn, Connection } from 'models/Connection';

@Resolver((_of) => User)
export class UserResolver {
  @Query((_returns) => User, { nullable: true })
  me(@Ctx('user') user: User | null): User | null {
    return user;
  }

  @Query((_returns) => [User])
  async search(@Arg('query') query: string): Promise<User[]> {
    const results = await User.search(query);
    return results;
  }

  @Mutation((_returns) => User)
  async signUp(
    @Ctx() context: Context,
    @Ctx('authContext') authContext: AuthenticationContext,
    @Arg('username') username: string,
    @Arg('phoneNumber') phoneNumber: string,
  ): Promise<User> {
    const user = await User.signUp({
      ...authContext,
      userName: username,
      phoneNumber,
    });
    await context.login(user);
    return user;
  }

  @Mutation((_returns) => Connection)
  async requestConnection(
    @Ctx('user') user: User,
    @Arg('to') to: ObjectId,
  ): Promise<Connection> {
    const connection = await Connection.requestConnection(user._id, to);
    return connection;
  }

  @Mutation((_returns) => ApproveConnectionReturn)
  async approveConnection(
    @Ctx('user') user: User,
    @Arg('connectionId') connectionId: ObjectId,
  ): Promise<ApproveConnectionReturn> {
    const connection = await Connection.approveConnection(connectionId, user);
    return connection;
  }
}
