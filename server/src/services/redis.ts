import Redis from 'ioredis';
import { RedisPubSub } from "graphql-redis-subscriptions";

const redisOptions = process.env.NODE_ENV === 'production'
  ? process.env.REDIS_URL
  : process.env.REDIS_PORT

export const redis = new Redis(redisOptions)
export const pubSub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions)
})