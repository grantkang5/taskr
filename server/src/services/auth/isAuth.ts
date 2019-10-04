import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../context';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  console.log('context.req.headers is', context.req.headers);
  return next();
};
