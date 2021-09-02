import "mocha";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import pino from "pino";

import { createServer } from "../src/server";

chai.use(chaiHttp);

// the log file would ideally be configurable, but then it would be another
// configuration variable to keep track of and would only make sense during
// testing, so it’s hard-coded for now
const app = createServer(pino(pino.destination("test.log")));

describe("GET /", () => {
  it("responds with 200", async () => {
    const response = await chai.request(app).get("/");
    assert.equal(response.status, 200);
  });
});
