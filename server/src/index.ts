import 'reflect-metadata';
// import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './resolvers/UserResolver';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cors from 'cors';

(async () => {
  const app = express();
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    })
  );

  app.get('/', (_req, res) => res.send('hello'));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
    context: ({ req, res }) => ({ req, res })
  });
  apolloServer.applyMiddleware({ app });

  await createConnection();

  app.listen(4000, () => console.log('express server started'));
})();
