import "dotenv/config";
import { Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { exec } from "child_process";
import { sign } from "jsonwebtoken";
import { Connection, createConnection } from "typeorm";
import { redis } from "../../services/redis";
import { UserResolver } from "../../resolvers/UserResolver";
import { TeamResolver } from "../../resolvers/TeamResolver";
import { ProjectResolver } from "../../resolvers/ProjectResolver";
import { LinkResolver } from "../../resolvers/LinkResolver";

export const testServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver, TeamResolver, ProjectResolver, LinkResolver]
  }),
  context: () => {
    return {
      req: {
        headers: {
          authorization: `bearer ${sign(
            { userId: 1 },
            process.env.ACCESS_TOKEN_SECRET!,
            {
              expiresIn: "15m"
            }
          )}`
        }
      },
      res: {
        cookie: (_res: Response, payload: string) => payload
      }
    };
  }
});

export const createTestDb = async () => {
  try {
    await exec("yarn db:seed");
    await redis.flushall();
    return await createConnection();
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const closeTestDb = async (connection: Connection) => {
  try {
    await connection.close();
    await redis.flushall();
    await redis.disconnect();
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};
