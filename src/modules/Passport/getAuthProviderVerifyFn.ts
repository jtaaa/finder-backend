import type { GetAuthProviderVerifyFn } from './types';

import createHttpError from 'http-errors';
import { UserModel } from 'models/User';

type AuthProviderIdField = 'googleId' | 'facebookId';

const getAuthProviderVerifyFn: GetAuthProviderVerifyFn = (
  idField: AuthProviderIdField,
) => async (_accessToken, _refreshToken, profile, done) => {
  const user = await UserModel.findOne({ [idField]: profile.id });
  if (user) return done(null, user);

  // Automatically link provider login to existing account with same email address
  const unlinkedUser = await UserModel.findOne({
    email: { $in: profile.emails?.map((email) => email.value) },
  });
  if (unlinkedUser) {
    unlinkedUser[idField] = profile.id;
    await unlinkedUser.save();
    return done(null, unlinkedUser);
  }

  // No matching user found so create a new user
  // Throw an error if the profile does not include a name or email
  if (!profile.name || !profile.emails || !profile.emails[0]) {
    throw createHttpError(
      400,
      'Profile returned by Google or FB is incomplete.',
      { profile, idField },
    );
  }

  // Create signup data based on the profile returned from Google or FB
  const sharedSignUpData = {
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value,
    [idField]: profile.id,
  };

  // Create the new user
  const newUser = await UserModel.signUp(sharedSignUpData);
  return done(null, newUser);
};

export default getAuthProviderVerifyFn;
