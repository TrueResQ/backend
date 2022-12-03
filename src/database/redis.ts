import { createClient } from "redis";

import createLogger from "../plugins/createLogger";

const log = createLogger("redis.ts");

const { REDIS_PORT, REDIS_HOSTNAME } = process.env;
const client = createClient({ socket: { host: REDIS_HOSTNAME, port: Number(REDIS_PORT) } });

client.connect();

client.on("error", (error) => {
  log.error(error);
});

client.on("ready", () => {
  log.info("Connected to redis");
});

export default client;
