import "mocha";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import pino from "pino";

import { createServer } from "../src/server";
import { ClinicData } from "../src/schema/data";
import { IClinic } from "../src/clinic";
import { parseData } from "../src/data";

chai.use(chaiHttp);

function loadLocalData(): readonly IClinic[] {
  const clinics: readonly ClinicData[] =
    require("./dental-clinics.json").concat(require("./vet-clinics.json"));

  return parseData(clinics);
}

// the log file would ideally be configurable, but then it would be another
// configuration variable to keep track of and would only make sense during
// testing, so it’s hard-coded for now
const app = createServer(pino(pino.destination("test.log")), async () =>
  loadLocalData(),
);
const request = chai.request(app).keepOpen();

const JSON_CONTENT_TYPE = "application/json";

describe("GET /search", () => {
  it("requires at least one valid parameter", async () => {
    const response1 = await request.get("/search");
    assert.equal(response1.status, 400);

    const response2 = await chai
      .request(app)
      .get("/search")
      .query({
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
      const response = await request.get("/search").query(req);
      assert.equal(response.status, 400);
    }
  });

  it("understands valid parameters", async () => {
    for (const [name, state, availability] of [
      ["Nothing that matches", "Unknown", { from: "00:00", to: "24:00" }],
      [" Mayo Clinic ", "Non-existent", { from: "02:00", to: "02:01" }],
    ]) {
      const response = await request
        .get("/search")
        .query({ name, state, availability });
      assert.equal(response.status, 200);
      assert.equal(response.type, JSON_CONTENT_TYPE);

      const parsed = JSON.parse(response.text);
      assert.deepEqual(parsed, []);
    }
  });

  it("matches based on state code", async () => {
    const response = await request.get("/search").query({
      state: "CA",
    });
    assert.equal(response.status, 200);
    assert.equal(response.type, JSON_CONTENT_TYPE);

    const parsed = JSON.parse(response.text);
    assert.deepEqual(parsed, [
      {
        name: "Mount Sinai Hospital",
        state: { name: "California", code: "CA" },
        availability: { from: "12:00", to: "22:00" },
      },
      {
        name: "Scratchpay Test Pet Medical Center",
        state: { name: "California", code: "CA" },
        availability: {
          from: "00:00",
          to: "24:00",
        },
      },
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

  it("matches clinics based on state name", async () => {
    const response = await request.get("/search").query({
      state: "CA",
    });
    assert.equal(response.status, 200);
    assert.equal(response.type, JSON_CONTENT_TYPE);

    const parsed = JSON.parse(response.text);
    assert.deepEqual(parsed, [
      {
        name: "Mount Sinai Hospital",
        state: { name: "California", code: "CA" },
        availability: { from: "12:00", to: "22:00" },
      },
      {
        name: "Scratchpay Test Pet Medical Center",
        state: { name: "California", code: "CA" },
        availability: {
          from: "00:00",
          to: "24:00",
        },
      },
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

  it("matches clinics case-insensitively based on name", async () => {
    const CASES = [
      [
        "german",
        [
          {
            name: "German Pets Clinics",
            state: { name: "Kansas", code: "KS" },
            availability: {
              from: "08:00",
              to: "20:00",
            },
          },
        ],
      ],
      [
        "good health",
        [
          {
            name: "Good Health Home",
            state: { name: "Alaska", code: "AK" },
            availability: {
              from: "10:00",
              to: "19:30",
            },
          },
          {
            name: "Good Health Home",
            state: { name: "Florida", code: "FL" },
            availability: {
              from: "15:00",
              to: "20:00",
            },
          },
        ],
      ],
    ];

    for (const [needle, results] of CASES) {
      const response = await request.get("/search").query({
        name: needle,
      });
      assert.equal(response.status, 200);
      assert.equal(response.type, JSON_CONTENT_TYPE);
      assert.deepEqual(JSON.parse(response.text), results);
    }
  });

  it("matches clinics based on availability", async () => {
    const CASES: readonly [string, string, readonly any[]][] = [
      [
        "00:00",
        "00:01",
        [
          {
            name: "Scratchpay Test Pet Medical Center",
            state: { name: "California", code: "CA" },
            availability: {
              from: "00:00",
              to: "24:00",
            },
          },
          {
            name: "Scratchpay Official practice",
            state: { name: "Tennessee", code: "TN" },
            availability: {
              from: "00:00",
              to: "24:00",
            },
          },
        ],
      ],
    ];

    for (const [from, to, results] of CASES) {
      const response = await request.get("/search").query({
        availability: { from, to },
      });
      assert.equal(response.status, 200);
      assert.equal(response.type, JSON_CONTENT_TYPE);
      assert.deepEqual(JSON.parse(response.text), results);
    }
  });

  it("matches clinics based on all criteria", async () => {
    const CASES = [
      ["Nationl", "California", "14:00", "24:00", []],
      ["veterina", "Alaska", "14:00", "24:00", []],
      ["veterina", "California", "22:45", "24:00", []],
      [
        "veterina",
        "California",
        "14:00",
        "24:00",
        [
          {
            name: "National Veterinary Clinic",
            state: { name: "California", code: "CA" },
            availability: {
              from: "15:00",
              to: "22:30",
            },
          },
        ],
      ],
    ];

    for (const [name, state, from, to, results] of CASES) {
      const response = await request.get("/search").query({
        name,
        state,
        availability: { from, to },
      });
      assert.equal(response.status, 200);
      assert.equal(response.type, JSON_CONTENT_TYPE);
      assert.deepEqual(JSON.parse(response.text), results);
    }
  });
});

after(() => {
  request.close();
});
