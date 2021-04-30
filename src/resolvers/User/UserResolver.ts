import { Resolver, Query, Ctx } from 'type-graphql';

import { User } from 'models/User';

@Resolver((_of) => User)
export class UserResolver {
  @Query((_returns) => User, { nullable: true })
  me(@Ctx('user') user: User | null): User | null {
    return user;
  }
}
