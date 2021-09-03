import "mocha";
import pino from "pino";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

require("dotenv-safe").config({ path: "testing.env" });

import { createServer } from "../src/server";
import { fetchData, parseData } from "../src/data";
import { API_URL, CLINIC_FILES } from "../src/config";
import { Server } from "http";

chai.use(chaiHttp);

const { PORT } = process.env;

const app = createServer(
  pino(pino.destination("integration-test.log")),
  async () => parseData(await fetchData(API_URL, CLINIC_FILES)),
);

describe("The API", async () => {
  let scopes: nock.Scope[] = [];
  before(() => {
    scopes.push(
      nock("https://storage.googleapis.com")
        .get("/scratchpay-code-challenge/vet-clinics.json")
        .reply(200, require("./vet-clinics.json"))
        .persist(),
    );
    scopes.push(
      nock("https://storage.googleapis.com")
        .get("/scratchpay-code-challenge/dental-clinics.json")
        .reply(200, require("./dental-clinics.json"))
        .persist(),
    );
  });
  after(() => {
    nock.cleanAll();
  });
  it("works correctly", async () => {
    const response = await chai
      .request(`http://localhost:${PORT}`)
      .get("/search")
      .query({
        name: "veterina",
        state: "California",
        availability: {
          from: "14:00",
          to: "24:00",
        },
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
  });
});

let server: Server;

before(() => {
  server = app.listen(PORT);
});

after(() => {
  if (server !== undefined) server.close();
});
