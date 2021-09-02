import express from "express";
import type { Logger } from "pino";
import pinoHttp from "pino-http";

import * as schema from "./schema/request";
import { ClinicData } from "./schema/data";
import { matches } from "./match";
import { parseClinicFromData } from "./clinic";

export function createServer(
  logger: Logger,
  fetchData: () => Promise<readonly ClinicData[]>,
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

    return res
      .status(200)
      .json(clinics.filter((c) => matches(parseClinicFromData(c), body)));
  });

  return app;
}
