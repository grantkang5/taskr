import { ApolloServer, PubSub } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { UserResolver } from './resolvers/UserResolver'

export const pubSub = new PubSub();

export const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver],
    pubSub
  }),
  context: ({ req, res }) => ({ req, res }),
});
