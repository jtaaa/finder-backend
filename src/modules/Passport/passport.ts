import passport from 'passport';

import { UserModel } from 'models/User';
import GoogleStrategy from './strategies/GoogleStrategy';
import FacebookStrategy from './strategies/FacebookStrategy';
import { AuthenticationContext } from './types';

passport.use(GoogleStrategy);
passport.use(FacebookStrategy);

passport.serializeUser((user, done) => {
  if (user._id) return done(null, user._id);
  done(null, user);
});

passport.deserializeUser((serializedUser, done) => {
  if ((serializedUser as AuthenticationContext).email) {
    return done(null, serializedUser as AuthenticationContext);
  }
  UserModel.findById(serializedUser, (err, user) => {
    done(err, user);
  });
});

export { passport };
