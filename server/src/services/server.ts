import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { pubSub } from "./redis";

import { UserResolver } from "../resolvers/UserResolver";
import { TeamResolver } from "../resolvers/TeamResolver";
import { ProjectResolver } from "../resolvers/ProjectResolver";
import { LinkResolver } from "../resolvers/LinkResolver";

export const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver, TeamResolver, ProjectResolver, LinkResolver],
    pubSub
  }),
  context: ({ req, res }) => ({ req, res })
});
