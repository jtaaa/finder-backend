import type { DocumentType } from '@typegoose/typegoose';
import express from 'express';

import { User as CustomUser } from 'models/User';
import { AuthenticationContext } from './types';

declare global {
  namespace Express {
    interface User extends AuthenticationContext, Partial<CustomUser> {}
  }
}
