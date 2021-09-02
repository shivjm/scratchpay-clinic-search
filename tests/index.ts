import "mocha";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";

import { createServer } from "../src/server";

chai.use(chaiHttp);

const app = createServer();

describe("GET /", () => {
  it("responds with 200", async () => {
    const response = await chai.request(app).get("/");
    assert.equal(response.status, 200);
  });
});
