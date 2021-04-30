import type { DocumentType } from '@typegoose/typegoose';
import type { Request } from 'apollo-server-express';
import type { AuthInfoTemplate, PassportContext } from 'graphql-passport';

import { ApolloServer } from 'apollo-server-express';
import { buildContext } from 'graphql-passport';

import { User } from 'models/User';
import createSchema from './Schema';
import { Logger } from 'modules/Logger';

type Credentials = { email: string; password?: string };
export interface Context
  extends PassportContext<User, Credentials, AuthInfoTemplate, Request> {}

export const prepareApolloServer = async (): Promise<ApolloServer> => {
  const schema = await createSchema();

  return new ApolloServer({
    schema,
    // would like to make this return type-safe as Promise<Context>
    // unfortunately the return type of buildContext does not match PassportContext<...>
    context: async ({ req, res }) => {
      const context = buildContext<User>({ req, res });

      let user: User | null = null;
      if (context.isAuthenticated()) {
        // Get user from graphql-passport context
        user = context.getUser();
        Logger.debug(user);
      }
      return Object.assign(context, { user });
    },
  });
};
