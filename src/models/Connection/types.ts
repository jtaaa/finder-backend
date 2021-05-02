import { Connection } from './ConnectionModel';
import { ObjectType, Field as GraphQLField } from 'type-graphql';
import { prop as DBProperty } from '@typegoose/typegoose';

@ObjectType()
export class ApproveConnectionReturn {
  @GraphQLField((_type) => Connection)
  connection!: Connection;

  @GraphQLField((_type) => Connection)
  reverseConnection!: Connection;
}

@ObjectType()
export class Coordinate {
  @GraphQLField()
  @DBProperty({ required: true })
  lng!: number;

  @GraphQLField()
  @DBProperty({ required: true })
  lat!: number;
}
