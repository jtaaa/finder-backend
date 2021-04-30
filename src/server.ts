import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

import { corsMiddleware, CORS_OPTIONS } from 'middleware/cors';
import { PORT } from 'modules/Constants';
import { Logger } from 'modules/Logger';
import { prepareApolloServer } from 'modules/Apollo';
import { passport } from 'modules/Passport';
import { sessionMiddleware } from 'middleware/session';
import { apiRouter } from 'routes/apiRouter';

// Immediately invoke async function to use async..await
(async () => {
  // Init express
  const server = express();

  // Cors setup
  server.use(corsMiddleware());

  // Setup middleware to parse incoming messages
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());

  // Session setup
  server.use(sessionMiddleware());

  // Passport setup
  server.use(passport.initialize());
  server.use(passport.session());

  // Serve GraphQl Apollo server on `/graphql`
  const ApolloServer = await prepareApolloServer();
  ApolloServer.applyMiddleware({ app: server, cors: CORS_OPTIONS });

  // Serve API routes on `/api`
  server.use('/api', apiRouter);

  // Print API errors
  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    Logger.error(err.message, err);
    const errorStatusCode = (err as any).statusCode ?? 400;
    return res.status(errorStatusCode).json(err);
  });

  // Start the server on PORT
  server.listen(PORT, () => {
    Logger.info(`Server is ready on http://localhost:${PORT}`);
  });
})();
