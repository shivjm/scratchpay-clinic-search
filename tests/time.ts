import { assert } from "chai";
import "mocha";

import { compare, greaterThan, lessThan, parseTime } from "../src/time";

describe("Time comparison", () => {
  it("should handle all sorts of cases", () => {
    const CASES: readonly [
      string, // a
      string, // b
      boolean, // gt(a, b)
      boolean, // lt(a, b)
      boolean, // gt(b, a)
      boolean, // lt(b, a)
    ][] = [
      ["00:00", "00:00", false, false, false, false],
      ["00:00", "00:01", false, true, true, false],
      ["00:00", "24:00", false, true, true, false],
      ["12:32", "11:32", true, false, false, true],
    ];
    for (const [a, b, gtAB, ltAB, gtBA, ltBA] of CASES) {
      const x = parseTime(a);
      const y = parseTime(b);

      assert.equal(greaterThan(x, y), gtAB);
      assert.equal(lessThan(x, y), ltAB);
      assert.equal(greaterThan(y, x), gtBA);
      assert.equal(lessThan(y, x), ltBA);
    }
  });
});
