import type { Request } from 'apollo-server-express';
import type { AuthInfoTemplate, PassportContext } from 'graphql-passport';

import { ApolloServer } from 'apollo-server-express';
import { buildContext } from 'graphql-passport';

import { User } from 'models/User';
import { AuthenticationContext } from 'modules/Passport';
import createSchema from './schema';

type Credentials = { email: string; password?: string };
export interface Context
  extends PassportContext<User, Credentials, AuthInfoTemplate, Request> {
  authContext: AuthenticationContext;
}

export const prepareApolloServer = async (): Promise<ApolloServer> => {
  const schema = await createSchema();

  return new ApolloServer({
    schema,
    // would like to make this return type-safe as Promise<Context>
    // unfortunately the return type of buildContext does not match PassportContext<...>
    context: async ({ req, res }) => {
      const context = buildContext<User>({ req, res });

      let authContext: AuthenticationContext | null = null;
      let user: User | null = null;
      if (context.isAuthenticated()) {
        // Get user from graphql-passport context
        user = context.getUser();

        // If is authenticated but not signed up then set the authContext
        if (!user._id) {
          authContext = user;
          user = null;
        }
      }
      return Object.assign(context, { user, authContext });
    },
  });
};
