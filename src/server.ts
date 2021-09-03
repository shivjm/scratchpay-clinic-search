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
): express.Application {
  const app = express();

  app.use(pinoHttp({ logger }));

  app.use(express.json());

  // (ESLint is right about this but here we have no remaining middleware to call)
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get("/search", async (req, res) => {
    const { query } = req;

    if (!schema.SearchRequest(query)) {
      return res.status(400).send({ message: "Cannot parse query" });
    }

    const { name, from, to, state } = query;

    if (
      name === undefined &&
      from === undefined &&
      to === undefined &&
      state === undefined
    ) {
      return res
        .status(400)
        .send({ message: "Must specify at least one search parameter" });
    }

    if (
      (from !== undefined || to !== undefined) &&
      !(from !== undefined && to !== undefined)
    ) {
      return res
        .status(400)
        .send({ message: "Must use `from` and `to` together" });
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

  if (request.from !== undefined && request.to !== undefined) {
    const { from, to } = request;
    params.availability = {
      from: parseTime(from),
      to: parseTime(to),
    };
  }

  return params;
}
