import { Connection } from './ConnectionModel';
import { ObjectType, Field as GraphQLField } from 'type-graphql';

@ObjectType()
export class ApproveConnectionReturn {
  @GraphQLField()
  connection!: Connection;

  @GraphQLField()
  reverseConnection!: Connection;
}
