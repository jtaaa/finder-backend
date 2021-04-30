import passport from 'passport';

import { UserModel } from 'models/User';
import GoogleStrategy from './strategies/GoogleStrategy';
import FacebookStrategy from './strategies/FacebookStrategy';

passport.use(GoogleStrategy);
passport.use(FacebookStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

export { passport };
