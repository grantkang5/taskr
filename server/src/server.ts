import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";

export const server = new ApolloServer({
  schema: buildSchemaSync({ resolvers: [UserResolver] }),
  context: ({ req, res }) => ({ req, res })
});