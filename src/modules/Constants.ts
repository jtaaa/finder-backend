/**
 * Port that the server listens on
 */
export const PORT = process.env.PORT ?? 3000;

/**
 * Connection String URI for mongoose to connect to the MongoDB
 * https://docs.mongodb.com/manual/reference/connection-string
 */
export const MONGO_CONNECTION_URI =
  process.env.MONGO_CONNECTION_URI ?? 'mongodb://localhost/finder';

/**
 * Root URL that the server is running on
 */
export const ROOT_URL = process.env.ROOT_URL ?? `http://localhost:${PORT}`;

/**
 * Secret used to encrypt and decrypt sessions
 */
export const SESSION_SECRET = process.env.SESSION_SECRET ?? `super-secret`;

/**
 * Google auth provider constants
 */
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

/**
 * Facebook auth provider constants
 */
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
