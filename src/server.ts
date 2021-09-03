import express from "express";
import type { Logger } from "pino";
import pinoHttp from "pino-http";

import * as schema from "./schema/request";
import { IMatchParameters, matches } from "./match";
import { IClinic, prepareClinicForSerialization } from "./clinic";
import { normalize } from "./text";
import { parseTime } from "./time";

export function createServer(
  logger: Logger,
  fetchData: () => Promise<readonly IClinic[]>,
) {
  const app = express();

  app.use(pinoHttp({ logger }));

  app.use(express.json());

  app.get("/search", async (req, res) => {
    const { query } = req;
    if (!schema.SearchRequest(query)) {
      return res.sendStatus(400);
    }

    const { name, availability, state } = query;

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

    const parameters = asMatchParameters(query);

    return res
      .status(200)
      .json(
        clinics
          .filter((c) => matches(c, parameters))
          .map(prepareClinicForSerialization),
      );
  });

  return app;
}

function asMatchParameters(request: schema.SearchRequest): IMatchParameters {
  const params: IMatchParameters = {};

  if (request.name !== undefined) {
    params.name = normalize(request.name).toLowerCase();
  }

  if (request.state !== undefined) {
    params.state = normalize(request.state);
  }

  if (request.availability !== undefined) {
    const { availability } = request;
    params.availability = {
      from: parseTime(availability.from),
      to: parseTime(availability.to),
    };
  }

  return params;
}
