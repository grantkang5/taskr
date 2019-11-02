import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { pubSub } from "./redis";

import { UserResolver } from "../resolvers/UserResolver";
import { TeamResolver } from "../resolvers/TeamResolver";

export const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver, TeamResolver],
    pubSub
  }),
  context: ({ req, res }) => ({ req, res })
});
