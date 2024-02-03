import winston from "winston";
import { __dirname } from "../utils.js";
import path from "path";
import { config } from "../config/config.js";

const currentEnv = config.server.environment;

const customLevels = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debbug: 3,
  },
  colors: {
    error: "red",
    warning: "yellow",
    info: "cyan",
    debbug: "magenta",
  },
};

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [new winston.transports.Console({ level: "debbug" })],
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "/logs/errors.log"),
      level: "warning",
    }),
  ],
});

let logger;
if (currentEnv === "development") {
  logger = devLogger;
} else {
  logger = prodLogger;
}
export { logger };
