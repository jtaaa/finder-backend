import express from 'express';

import passport from 'passport';
import { setReturnToMiddleware } from 'middleware/setReturnTo';

const authRouter = express.Router();

authRouter.get('/signout', (req, res) => {
  const returnTo = (req.query.returnTo as string | undefined) ?? '/';
  req.logout();
  res.redirect(returnTo);
});

authRouter.get(
  '/google',
  setReturnToMiddleware,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { successReturnToOrRedirect: '/' }),
);

authRouter.get(
  '/facebook',
  setReturnToMiddleware,
  passport.authenticate('facebook', { scope: ['email'] }),
);

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { successReturnToOrRedirect: '/' }),
);

export default authRouter;
