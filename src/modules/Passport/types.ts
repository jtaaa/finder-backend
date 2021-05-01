import type { Profile } from 'passport';

type AuthProviderIdField = 'googleId' | 'facebookId';
export type GetAuthProviderVerifyFn = (
  idField: AuthProviderIdField,
) => (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (error: unknown, user?: unknown) => void,
) => Promise<void>;

export type AuthenticationContext = {
  firstName: string;
  lastName: string;
  email: string;
  googleId?: string;
  facebookId?: string;
};
