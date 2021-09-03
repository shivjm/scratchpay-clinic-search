import crypto from "crypto";

import got from "got";

import { IClinic, parseClinicFromData } from "./clinic";
import { Memoized } from "./memoize";
import { ClinicData } from "./schema/data";

/** A character that can be used to separate parts of a clinic’s data in a string. */
const INVISIBLE_SEPARATOR = "⁣";

export function createCachedFetch(
  apiUrl: string,
  types: readonly string[],
  timeoutSeconds: number,
  maxAgeSeconds: number,
): Memoized<readonly ClinicData[]> {
  return new Memoized(
    () => fetchData(apiUrl, types, timeoutSeconds),
    maxAgeSeconds,
  );
}

export async function fetchData(
  apiUrl: string,
  types: readonly string[],
  timeoutSeconds: number,
): Promise<readonly ClinicData[]> {
  const dataSets = await Promise.all(
    types.map((type) => fetchFile(apiUrl, type, timeoutSeconds)),
  );

  return dataSets.flat();
}

async function fetchFile(
  apiUrl: string,
  type: string,
  timeoutSeconds: number,
): Promise<readonly ClinicData[]> {
  const json = await got(`${apiUrl}${type}-clinics.json`, {
    timeout: timeoutSeconds * 1000,
  }).json();

  if (!Array.isArray(json)) {
    throw new Error(`Invalid ${type} data file`);
  }

  return json.flatMap((c) => {
    if (!ClinicData(c)) {
      return [];
    }

    return [c];
  });
}

export function parseData(data: readonly ClinicData[]): readonly IClinic[] {
  const existing = new Set();

  const unique = [];

  for (const c of data) {
    const parsed = parseClinicFromData(c);
    const id = sha256(
      [parsed.name, parsed.state.code].join(INVISIBLE_SEPARATOR),
    );

    if (!existing.has(id)) {
      unique.push(parsed);
      existing.add(id);
    }
  }

  return unique;
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
