import "mocha";
import pino from "pino";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

require("dotenv-safe").config({ path: "testing.env" });

import { createServer } from "../src/server";
import { createCachedFetch, fetchData, parseData } from "../src/data";
import {
  API_URL,
  CLINIC_FILES,
  DATA_CACHE_DURATION,
  PORT,
  TIMEOUT,
} from "../src/config";

chai.use(chaiHttp);

describe("The API", async () => {
  let scopes: nock.Scope[] = [];
  const count = { vet: 0, dental: 0 };
  before(() => {
    scopes.push(
      nock("https://storage.googleapis.com")
        .get("/scratchpay-code-challenge/vet-clinics.json")
        .reply(200, () => {
          count.vet++;
          return require("./vet-clinics.json");
        })
        .persist(),
    );
    scopes.push(
      nock("https://storage.googleapis.com")
        .get("/scratchpay-code-challenge/dental-clinics.json")
        .reply(200, () => {
          count.dental++;
          return require("./dental-clinics.json");
        })
        .persist(),
    );
  });
  after(() => {
    nock.cleanAll();
  });
  it("works correctly", async () => {
    const fn = async () => {
      for (let i = 0; i < 3; i++) {
        const response = await chai
          .request(`http://localhost:${PORT}`)
          .get("/search")
          .query({
            name: "veterina",
            state: "California",
            from: "14:00",
            to: "24:00",
          });

        assert.equal(response.status, 200);
        assert.deepEqual(JSON.parse(response.text), [
          {
            name: "National Veterinary Clinic",
            state: { name: "California", code: "CA" },
            availability: {
              from: "15:00",
              to: "22:30",
            },
          },
        ]);
      }
    };

    const cache = createCachedFetch(
      API_URL,
      CLINIC_FILES,
      DATA_CACHE_DURATION,
      TIMEOUT,
    );

    const app = createServer(
      pino(pino.destination("integration-test.log")),
      async () => parseData(await cache.get()),
    );

    const server = app.listen(PORT);

    try {
      await fn();

      assert.deepEqual(count, { vet: 1, dental: 1 });
    } finally {
      server.close();
    }

    const app2 = createServer(
      pino(pino.destination("integration-test.log")),
      async () => parseData(await fetchData(API_URL, CLINIC_FILES, TIMEOUT)),
    );

    const server2 = app2.listen(PORT);

    try {
      await fn();

      assert.deepEqual(count, { vet: 4, dental: 4 });
    } finally {
      server2.close();
    }
  });
});
