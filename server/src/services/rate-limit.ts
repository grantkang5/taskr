import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./context";
import { redis } from "./redis";

const expireDuration = 60 * 60
/**
 * @param limit Number of times to be called before limiting the next middleware
 */
export const rateLimit: (limit?: number) => MiddlewareFn<MyContext> = (
  limit = 45
) => async ({ context, info }, next) => {
  // info.fieldName is the fieldName of the graphql query
  // req.ip is being used because we also handle auth in graphql
  const key = `rate-limit:${info.fieldName}:${context.req.ip}`;
  const current = await redis.incr(key);
  if (current > limit) {
    throw new Error(`You've made too many requests, try again in an hour`)
  } else if (current === 1) {
    await redis.expire(key, expireDuration)
  }
  return next();
};
