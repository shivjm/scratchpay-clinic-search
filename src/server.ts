import express from "express";
import type { Logger } from "pino";
import pinoHttp from "pino-http";

export function createServer(logger: Logger) {
  const app = express();

  app.use(pinoHttp({ logger }));

  app.get("/", (_req, res) => {
    res.send("OK");
  });

  return app;
}
