import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "../../resolvers/UserResolver";
import { execSync } from 'child_process'

export const testServer = new ApolloServer({
  schema: buildSchemaSync({ resolvers: [UserResolver] }),
  context: ({ req, res }) => {
    return { req, res }
  }
});

export const initDb = async () => await execSync('npm run db:seed')