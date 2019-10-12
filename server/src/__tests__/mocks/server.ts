import 'dotenv/config'
import { Response } from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "../../resolvers/UserResolver";
import { exec } from "child_process";
import { sign } from "jsonwebtoken";

export const testServer = new ApolloServer({
  schema: buildSchemaSync({ resolvers: [UserResolver] }),
  context: () => {
    return {
      req: {
        headers: {
          authorization: `bearer ${sign({ userId: 1 }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: "15m"
          })}`
        }
      },
      res: {
        cookie: (_res: Response, payload: string) => payload
      }
    };
  }
});

export const initDb = async () => await exec('yarn db:seed')