import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";

import { UserResolver } from "../resolvers/UserResolver";
import { pubSub } from "./redis";

export const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver],
    pubSub
  }),
  context: ({ req, res }) => ({ req, res })
});
