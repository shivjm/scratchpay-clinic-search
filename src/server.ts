import express from "express";
import type { Logger } from "pino";
import pinoHttp from "pino-http";

import * as schema from "./schema";

export function createServer(logger: Logger) {
  const app = express();

  app.use(pinoHttp({ logger }));

  app.use(express.json());

  app.get("/search", (req, res) => {
    const { body } = req;

    if (!schema.SearchRequest(body)) {
      return res.sendStatus(400);
    }

    const { name, availability, state } = body;

    if (
      name === undefined &&
      availability === undefined &&
      state === undefined
    ) {
      // at least one parameter must be provided
      return res.sendStatus(400);
    }

    return res.sendStatus(200);
  });

  return app;
}
