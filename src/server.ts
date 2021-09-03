import express from "express";
import type { Logger } from "pino";
import pinoHttp from "pino-http";

import * as schema from "./schema/request";
import { matches } from "./match";
import { IClinic, prepareClinicForSerialization } from "./clinic";

export function createServer(
  logger: Logger,
  fetchData: () => Promise<readonly IClinic[]>,
) {
  const app = express();

  app.use(pinoHttp({ logger }));

  app.use(express.json());

  app.get("/search", async (req, res) => {
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

    // the data could be fetched in middleware, but then we’d unnecessarily
    // fetch it even for invalid requests
    const clinics = await fetchData();

    // TODO normalize search request to avoid doing it in every comparison

    return res
      .status(200)
      .json(
        clinics
          .filter((c) => matches(c, body))
          .map(prepareClinicForSerialization),
      );
  });

  return app;
}
