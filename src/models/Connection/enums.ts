import { registerEnumType } from 'type-graphql';

export enum Visibility {
  NotVisible,
  VisibleWhenMoving,
  AlwaysVisible,
}

registerEnumType(Visibility, {
  name: 'Visibility',
  description:
    'The visibility setting that the owner allows for the connected user.',
});
