import { ObjectId } from 'mongodb';
import { buildSchema } from 'type-graphql';

import { UserResolver } from 'resolvers/User';
import { ObjectIdScalar } from './scalars/object-id.scalar';
import { DateScalar } from './scalars/date.scalar';

const createSchema = async (): Promise<ReturnType<typeof buildSchema>> =>
  await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
      { type: Date, scalar: DateScalar },
    ],
    validate: false,
  });

export default createSchema;
