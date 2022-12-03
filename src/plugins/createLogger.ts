import * as Sentry from "@sentry/node";
import { createLogger } from "@toruslabs/loglevel-sentry";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";

prefix.reg(log);
log.enableAll();

prefix.apply(log, {
  template: "[%t] %l:",
  levelFormatter(level) {
    return level.toUpperCase();
  },
  nameFormatter(name) {
    return name || "root";
  },
  format: undefined,
  timestampFormatter(date) {
    return date.toISOString();
  },
});

export default (name: string): log.Logger => createLogger(name, Sentry);
