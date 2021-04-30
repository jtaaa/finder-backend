import type { DocumentType } from '@typegoose/typegoose';
import express from 'express';

import { User as CustomUser } from 'models/User';

declare global {
  namespace Express {
    interface User extends CustomUser {}
  }
}
