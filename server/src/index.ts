import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import cookieParser from "cookie-parser";
import { refreshAccessToken } from "./services/auth/refreshAccessToken";
import { server } from "./services/server";
import { createServer } from "http";
import { redis } from "./services/redis";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  const app = express();
  app.use(
    cors({  
      origin: process.env.CLIENT_URL,
      credentials: true
    })
  );

  app.use("/refresh_token", cookieParser());

  app.get("/", (_req, res) => res.send("taskr api"));
  app.post("/refresh_token", refreshAccessToken);

  server.applyMiddleware({ app, cors: false });
  const ws = createServer(app)
  server.installSubscriptionHandlers(ws)
  await createConnection();
  redis.set('foo', 'bar')
  redis.get('foo', (_err, res) => {
    console.log(res)
  })
  ws.listen(PORT, () => console.log(`Express server listening on ${PORT}`));
};

startServer();
