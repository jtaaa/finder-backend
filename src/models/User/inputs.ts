import { Field as GraphQLField, InputType } from 'type-graphql';

@InputType()
export class NewUserInput {
  @GraphQLField()
  email!: string;

  @GraphQLField()
  username!: string;

  @GraphQLField()
  phoneNumber!: string;

  @GraphQLField()
  firstName!: string;

  @GraphQLField()
  lastName!: string;

  @GraphQLField({ nullable: true })
  googleId?: string;

  @GraphQLField({ nullable: true })
  facebookId?: string;
}
