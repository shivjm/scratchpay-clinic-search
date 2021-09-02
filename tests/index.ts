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

describe("GET /search", () => {
  it("requires at least one valid parameter", async () => {
    const response1 = await chai.request(app).get("/search");
    assert.equal(response1.status, 400);

    const response2 = await chai
      .request(app)
      .get("/search")
      .send({
        name: "	\n ",
        state: "   \n",
        availability: { from: "0900", to: "5050" },
      });
    assert.equal(response2.status, 400);
  });

  it("does not allow invalid parameters", async () => {
    for (const req of [
      { name: "x", extra: "y" },
      { availability: { from: "05:00", to: "09:00", on: "12" } },
    ]) {
      const response = await chai.request(app).get("/search").send(req);
      assert.equal(response.status, 400);
    }
  });

  it("understands valid parameters", async () => {
    for (const [name, state, availability] of [
      ["anything", "CA", { from: "00:00", to: "24:00" }],
      ["  X  ", "Victoria", { from: "02:00", to: "02:01" }],
    ]) {
      const response = await chai
        .request(app)
        .get("/search")
        .send({ name, state, availability });
      assert.equal(response.status, 200);
    }
  });
});
