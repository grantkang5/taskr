import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import cookieParser from "cookie-parser";
import { refreshAccessToken } from "./services/auth/refreshAccessToken";
import { server } from "./server";

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

  app.get("/", (_req, res) => res.send("hello"));
  app.post("/get_refresh", cookieParser(), (req, res) => {
    console.log("HEY WE ARE IN GET REFRESH ROUTE: ", req.cookies)
    res.send({ cookie: req.cookies.qid })
  })
  

  app.post("/refresh_token", refreshAccessToken);
  server.applyMiddleware({ app, cors: false });
  await createConnection();
  app.listen(PORT, () => console.log(`Express server listening on ${PORT}`));
};

startServer();
