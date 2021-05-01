import {
  Resolver,
  Query,
  Ctx,
  Mutation,
  Arg,
  FieldResolver,
} from 'type-graphql';

import { AuthenticationContext } from 'modules/Passport';
import { Context } from 'modules/Apollo';
import { User } from 'models/User';
import { Connection } from 'models/Connection';

@Resolver((_of) => User)
export class UserResolver {
  @FieldResolver((_type) => [Connection])
  async connections(@Ctx('user') user: User): Promise<Connection[]> {
    return await Connection.getOwnedConnections(user._id);
  }

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
}
