import session from 'express-session';
import connectMongo from 'connect-mongo';

import { mongoose } from 'modules/Mongoose';
import { SESSION_SECRET } from 'modules/Constants';

declare module 'express-session' {
  interface SessionData {
    returnTo: string;
  }
}

const MongoStore = connectMongo(session);
export const sessionMiddleware = () =>
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'finder-token',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  });
