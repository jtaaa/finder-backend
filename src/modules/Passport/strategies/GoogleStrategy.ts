import type { Request, Response } from 'express';

import { OAuth2Strategy } from 'passport-google-oauth';

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ROOT_URL,
} from 'modules/Constants';
import getAuthProviderVerifyFn from '../getAuthProviderVerifyFn';

const GoogleStrategy = new OAuth2Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${ROOT_URL}/api/auth/google/callback`,
  },
  getAuthProviderVerifyFn('googleId'),
);

export default GoogleStrategy;
