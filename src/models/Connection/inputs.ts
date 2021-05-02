import { Field as GraphQLField, InputType } from 'type-graphql';
import { prop as DBProperty } from '@typegoose/typegoose';

@InputType()
export class CoordinateInput {
  @GraphQLField()
  @DBProperty({ required: true })
  lng!: number;

  @GraphQLField()
  @DBProperty({ required: true })
  lat!: number;
}
