import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './resolvers/UserResolver';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { refreshAccessToken } from './services/auth/refreshAccessToken';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  const app = express();
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    })
  );

  app.use('/refresh_token', cookieParser());

  app.get('/', (_req, res) => res.send('hello'));

  app.post('/refresh_token', refreshAccessToken);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });
  await createConnection();

  app.listen(PORT, () => console.log(`Express server listening on ${PORT}`));
}

startServer();
