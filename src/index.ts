/* eslint-disable import/first */
import { errors } from "celebrate";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { Server } from "http";
import log from "loglevel";
import morgan from "morgan";
import path from "path";
const envPath = path.resolve(".", process.env.NODE_ENV !== "production" ? ".env.development" : ".env");

// setup environment
dotenv.config({
  path: envPath,
});

import { registerSentry, registerSentryErrorHandler } from "./plugins/sentry"; // converts body to json
// bring all routes here
import routes from "./routes";

// setup app
const app = express();
const http = new Server(app);
// for elb, https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
http.keepAliveTimeout = 301 * 1000;
http.headersTimeout = 305 * 1000;

app.set("trust proxy", 1);

// setup Sentry
registerSentry(app);

// setup middleware
const corsOptions = {
  //   origin: ["https://localhost:3000", /\.tor\.us$/],
  origin: true,
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-embed-host", "sentry-trace", "baggage"],
  methods: "GET,PUT,PATCH,POST,DELETE",
  maxAge: 86400,
};

app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") app.use(morgan("dev")); // HTTP logging
app.use(compression()); // Cause ALB doesn't compress
app.use(cors(corsOptions)); // middleware to enables cors
app.use(helmet()); // middleware which adds http headers
app.use(express.urlencoded({ extended: false })); // middleware which parses body
app.use(express.json());

app.use("/", routes);
app.use(errors());

registerSentryErrorHandler(app);
const port = process.env.PORT || 2020;

http.listen(port, () => log.info(`Server running on port: ${port}`));
