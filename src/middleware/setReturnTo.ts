import { RequestHandler } from 'express';

export const setReturnToMiddleware: RequestHandler = (
  req,
  _res,
  next,
): void => {
  if (req.session) {
    req.session.returnTo = req.query.returnTo?.toString();
  }
  next();
};
