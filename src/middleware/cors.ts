import type { CorsOptions } from 'cors';

import cors from 'cors';

import { ROOT_URL } from 'modules/Constants';

export const CORS_OPTIONS: CorsOptions = {
  origin: [ROOT_URL],
  credentials: true,
};

export const corsMiddleware = () => {
  return cors(CORS_OPTIONS);
};
