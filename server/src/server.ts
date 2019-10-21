import { ApolloServer, PubSub } from "apollo-server-express";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { buildSchemaSync } from "type-graphql";

import { UserResolver } from "./resolvers/UserResolver";
import { PubSubRedisOptions } from "graphql-redis-subscriptions/dist/redis-pubsub";

const redisConfig =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL
    : {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      };

export const pubSub =
  process.env.NODE_ENV === "development"
    ? new PubSub()
    : new RedisPubSub(redisConfig as PubSubRedisOptions);

export const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver],
    pubSub
  }),
  context: ({ req, res }) => ({ req, res })
});
