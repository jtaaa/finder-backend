import { Strategy } from 'passport-facebook';

import {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  ROOT_URL,
} from 'modules/Constants';
import getAuthProviderVerifyFn from '../getAuthProviderVerifyFn';

const FacebookStrategy = new Strategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${ROOT_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'emails'],
  },
  getAuthProviderVerifyFn('facebookId'),
);

export default FacebookStrategy;
