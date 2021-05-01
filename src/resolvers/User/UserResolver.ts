import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql';

import { User } from 'models/User';
import { AuthenticationContext } from 'modules/Passport';

@Resolver((_of) => User)
export class UserResolver {
  @Query((_returns) => User, { nullable: true })
  me(@Ctx('user') user: User | null): User | null {
    return user;
  }

  @Mutation((_returns) => User)
  async signUp(
    @Ctx('authContext') authContext: AuthenticationContext,
    @Arg('username') username: string,
    @Arg('phoneNumber') phoneNumber: string,
  ): Promise<User> {
    return await User.signUp({ ...authContext, username, phoneNumber });
  }
}
