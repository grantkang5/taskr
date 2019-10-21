import { ApolloServer, PubSub } from "apollo-server-express";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { buildSchemaSync } from "type-graphql";

import { UserResolver } from "./resolvers/UserResolver";
import { PubSubRedisOptions } from "graphql-redis-subscriptions/dist/redis-pubsub";

export const pubSub =
  process.env.NODE_ENV === "production"
    ? new RedisPubSub(process.env.REDIS_URL as PubSubRedisOptions)
    : new PubSub()

export const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver],
    pubSub
  }),
  context: ({ req, res }) => ({ req, res })
});
